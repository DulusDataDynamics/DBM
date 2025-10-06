'use client';

import { chat } from '@/ai/flows/chat';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Message = {
    text: string;
    isUser: boolean;
};

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    commandIsLoading: boolean;
    addMessage: (message: Message, isCommand?: boolean) => Promise<void>;
    clearMessages: () => void;
    setCommandIsLoading: (isLoading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commandIsLoading, setCommandIsLoading] = useState(false);

    const addMessage = useCallback(async (message: Message, isCommand: boolean = false) => {
        setMessages(prev => [...prev, message]);

        if (message.isUser && !isCommand) {
            setIsLoading(true);
            try {
                const response = await chat(message.text);
                setMessages(prev => [...prev, { text: response.reply, isUser: false }]);
            } catch (error) {
                console.error("Chatbot error:", error);
                const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);


    return (
        <ChatContext.Provider value={{ messages, isLoading, addMessage, clearMessages, commandIsLoading, setCommandIsLoading }}>
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
