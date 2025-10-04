'use client';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Bot, Send, User as UserIcon } from "lucide-react";
import { chat } from '@/ai/flows/chat';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
    text: string;
    isUser: boolean;
};

export default function ChatbotPage() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat(input);
            const botMessage: Message = { text: response.reply, isUser: false };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const userAvatar = user?.photoURL;
    const userFallback = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <PageHeader title="AI Chatbot" description="Ask me anything about your business." />
            <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-sm">
                <ScrollArea className="flex-1 p-6 space-y-4" ref={scrollAreaRef}>
                     <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-4", message.isUser ? "justify-end" : "")}>
                                {!message.isUser && (
                                     <Avatar className="h-9 w-9 border">
                                        <div className="bg-primary aspect-square h-full w-full flex items-center justify-center rounded-full text-primary-foreground">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-md rounded-lg p-3", message.isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                {message.isUser && (
                                     <Avatar className="h-9 w-9">
                                        {userAvatar && <AvatarImage src={userAvatar} alt="User Avatar" />}
                                        <AvatarFallback>{userFallback.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                             <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <div className="bg-primary aspect-square h-full w-full flex items-center justify-center rounded-full text-primary-foreground">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                </Avatar>
                                <div className="max-w-md rounded-lg p-3 bg-muted">
                                    <p className="text-sm animate-pulse">Dulus is thinking...</p>
                                </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <div className="relative">
                        <Input
                            placeholder="Type your message..."
                            className="pr-12"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
