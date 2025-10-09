'use client';

import { runCommand } from '@/ai/flows/command-flow';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export type Message = {
    text: string;
    isUser: boolean;
};

export type ChatSession = {
    id: string;
    title: string;
    createdAt: Date;
    messages: Message[];
}

interface ChatContextType {
    sessions: Omit<ChatSession, 'messages'>[];
    activeSession: ChatSession | null;
    isLoading: boolean;
    commandIsLoading: boolean;
    loadSession: (sessionId: string) => void;
    createNewSession: () => Promise<void>;
    addMessage: (message: Message, isFromCommandBar?: boolean) => Promise<void>;
    setCommandIsLoading: (isLoading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const firestore = useFirestore();

    const [sessions, setSessions] = useState<Omit<ChatSession, 'messages'>[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commandIsLoading, setCommandIsLoading] = useState(false);

    const loadSession = useCallback(async (sessionId: string) => {
        if(!user || !firestore) return;
        // Prevent re-loading the same session
        if (activeSession?.id === sessionId) return;

        setIsLoading(true);
        const sessionRef = doc(firestore, `users/${user.uid}/chatSessions`, sessionId);
        
        try {
            const sessionSnap = await getDoc(sessionRef);

            if(sessionSnap.exists()) {
                const data = sessionSnap.data();
                setActiveSession({
                    id: sessionSnap.id,
                    title: data.title,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    messages: data.messages || []
                });
            }
        } catch (error) {
             const contextualError = new FirestorePermissionError({
              operation: 'get',
              path: sessionRef.path,
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsLoading(false);
        }
    }, [user, firestore, activeSession?.id]);

    const createNewSession = useCallback(async () => {
        if(!user || !firestore) return;
        setIsLoading(true);

        const newSessionData = {
            title: "New Chat",
            createdAt: serverTimestamp(),
            messages: [],
        };
        const sessionsCollection = collection(firestore, `users/${user.uid}/chatSessions`);
        try {
            // The `addDoc` call will trigger the `onSnapshot` listener, 
            // which will then add the new session to the `sessions` list and make it active.
            const docRef = await addDoc(sessionsCollection, newSessionData);
            // Immediately load the new session
            loadSession(docRef.id);
        } catch (error) {
            const contextualError = new FirestorePermissionError({
                operation: 'create',
                path: sessionsCollection.path,
                requestResourceData: newSessionData,
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsLoading(false);
        }
    }, [user, firestore, loadSession]);
    
    // Subscribe to user's chat sessions
    useEffect(() => {
        if (!user || !firestore) return;

        const sessionsQuery = query(
            collection(firestore, `users/${user.uid}/chatSessions`),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
            const userSessions = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    createdAt: data.createdAt?.toDate() || new Date(),
                };
            });
            setSessions(userSessions);
            
            // If there's no active session, or the active session was deleted, load the most recent one.
            if ((!activeSession && userSessions.length > 0) || (activeSession && !userSessions.some(s => s.id === activeSession.id))) {
                loadSession(userSessions[0].id);
            } else if (userSessions.length === 0) {
                 // If there are no sessions at all, create a new one.
                 // The listener will then pick it up and set it as active.
                createNewSession();
            }
        }, (error) => {
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path: `users/${user.uid}/chatSessions`,
            });
            errorEmitter.emit('permission-error', contextualError);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, firestore]);

    const addMessage = useCallback(async (message: Message, isFromCommandBar: boolean = false) => {
        if (!activeSession || !user || !firestore) return;

        const sessionRef = doc(firestore, `users/${user.uid}/chatSessions`, activeSession.id);
        
        // Optimistically update UI
        const optimisticMessages = [...activeSession.messages, message];
        setActiveSession(prev => {
            if (!prev) return null;
            return { ...prev, messages: optimisticMessages };
        });

        // Update firestore
        // We also update the title if it's the first user message
        const updateData: { messages: Message[], title?: string } = { messages: optimisticMessages };
        if(activeSession.messages.length === 0 && message.isUser) {
            updateData.title = message.text.substring(0, 50);
        }

        updateDoc(sessionRef, updateData).catch(error => {
            const contextualError = new FirestorePermissionError({
                path: sessionRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', contextualError);
            // Revert optimistic update on error
            setActiveSession(prev => prev ? ({ ...prev, messages: activeSession.messages }) : null);
        });

        // If the message is from the user, process it as a command.
        if (message.isUser) {
            const currentLoadingState = isFromCommandBar ? setCommandIsLoading : setIsLoading;
            currentLoadingState(true);
            try {
                const response = await runCommand({ command: message.text, userId: user.uid });
                const botMessage = { text: response.reply, isUser: false };
                
                // Final update with bot message
                const finalMessages = [...optimisticMessages, botMessage];
                 setActiveSession(prev => prev ? ({...prev, messages: finalMessages}) : null);

                updateDoc(sessionRef, { messages: finalMessages }).catch(error => {
                     const contextualError = new FirestorePermissionError({
                        path: sessionRef.path,
                        operation: 'update',
                        requestResourceData: { messages: finalMessages },
                    });
                    errorEmitter.emit('permission-error', contextualError);
                });

            } catch (error) {
                console.error("AI command error:", error);
                const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false };
                
                const errorMessages = [...optimisticMessages, errorMessage];
                setActiveSession(prev => prev ? ({...prev, messages: errorMessages}) : null);
                 updateDoc(sessionRef, { messages: errorMessages }).catch(error => {
                     const contextualError = new FirestorePermissionError({
                        path: sessionRef.path,
                        operation: 'update',
                        requestResourceData: { messages: errorMessages },
                    });
                    errorEmitter.emit('permission-error', contextualError);
                });

            } finally {
                currentLoadingState(false);
            }
        }
    }, [activeSession, user, firestore, setCommandIsLoading]);


    return (
        <ChatContext.Provider value={{ 
            sessions, 
            activeSession, 
            isLoading, 
            commandIsLoading, 
            loadSession, 
            createNewSession, 
            addMessage, 
            setCommandIsLoading 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
