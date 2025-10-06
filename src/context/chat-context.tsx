'use client';

import { chat } from '@/ai/flows/chat';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

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
    createNewSession: () => void;
    addMessage: (message: Message, isCommand?: boolean) => Promise<void>;
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
                    createdAt: data.createdAt.toDate(),
                };
            });
            setSessions(userSessions);
            
            // If there's no active session, load the latest one or create a new one
            if (!activeSession && userSessions.length > 0) {
                loadSession(userSessions[0].id);
            } else if (!activeSession && userSessions.length === 0) {
                createNewSession();
            }
        });

        return () => unsubscribe();
    }, [user, firestore]);
    
    const loadSession = useCallback(async (sessionId: string) => {
        if(!user || !firestore) return;
        setIsLoading(true);
        const sessionRef = doc(firestore, `users/${user.uid}/chatSessions`, sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if(sessionSnap.exists()) {
            const data = sessionSnap.data();
            setActiveSession({
                id: sessionSnap.id,
                title: data.title,
                createdAt: data.createdAt.toDate(),
                messages: data.messages || []
            });
        }
        setIsLoading(false);
    }, [user, firestore]);

    const createNewSession = useCallback(async () => {
        if(!user || !firestore) return;
        setIsLoading(true);

        const newSessionData = {
            title: "New Chat",
            createdAt: serverTimestamp(),
            messages: [],
        };
        const sessionsCollection = collection(firestore, `users/${user.uid}/chatSessions`);
        const docRef = await addDoc(sessionsCollection, newSessionData);
        
        setActiveSession({
            id: docRef.id,
            title: newSessionData.title,
            createdAt: new Date(), // Approximate
            messages: [],
        });
        setIsLoading(false);

    }, [user, firestore]);

    const addMessage = useCallback(async (message: Message, isCommand: boolean = false) => {
        if (!activeSession || !user || !firestore) return;

        const sessionRef = doc(firestore, `users/${user.uid}/chatSessions`, activeSession.id);

        // Add user message immediately
        const updatedMessages = [...activeSession.messages, message];
        setActiveSession(prev => prev ? { ...prev, messages: updatedMessages } : null);
        await updateDoc(sessionRef, { messages: updatedMessages });


        if (message.isUser && !isCommand) {
            setIsLoading(true);
            try {
                const response = await chat(message.text);
                const botMessage = { text: response.reply, isUser: false };
                
                // Fetch the latest messages again before updating
                const currentSessionSnap = await getDoc(sessionRef);
                const currentMessages = currentSessionSnap.data()?.messages || [];
                const finalMessages = [...currentMessages, botMessage];

                setActiveSession(prev => prev ? { ...prev, messages: finalMessages } : null);
                await updateDoc(sessionRef, { messages: finalMessages });

            } catch (error) {
                console.error("Chatbot error:", error);
                const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false };
                const currentSessionSnap = await getDoc(sessionRef);
                const currentMessages = currentSessionSnap.data()?.messages || [];
                const finalMessages = [...currentMessages, errorMessage];

                setActiveSession(prev => prev ? { ...prev, messages: finalMessages } : null);
                await updateDoc(sessionRef, { messages: finalMessages });
            } finally {
                setIsLoading(false);
            }
        }
    }, [activeSession, user, firestore]);


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
