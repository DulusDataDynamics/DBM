'use client';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User as UserIcon, Settings, MessageSquarePlus, History, ImageIcon, Star } from "lucide-react";
import { chat } from '@/ai/flows/chat';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type Message = {
    text: string;
    isUser: boolean;
};

export default function ChatbotPage() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement>(null);

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
        if (scrollViewportRef.current) {
            setTimeout(() => {
                scrollViewportRef.current!.scrollTo({
                    top: scrollViewportRef.current!.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [messages]);

    const userAvatar = user?.photoURL;
    const userFallback = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

    return (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-8rem)] gap-6">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-4 border-r pr-6">
                <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquarePlus className="h-4 w-4" /> New Chat
                </Button>
                <Separator />
                <h3 className="text-sm font-semibold text-muted-foreground px-2">History</h3>
                <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-2">
                        {/* Placeholder for chat history items */}
                        <Button variant="ghost" className="w-full justify-start gap-2 truncate">
                            <History className="h-4 w-4" /> Initial chat about sales
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 truncate">
                            <History className="h-4 w-4" /> Invoicing questions
                        </Button>
                    </div>
                </ScrollArea>
                <Separator />
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <ImageIcon className="h-4 w-4" /> Images
                    </Button>
                     <Button variant="ghost" className="w-full justify-start gap-2">
                        <Star className="h-4 w-4" /> Client Reviews
                    </Button>
                     <Button variant="ghost" className="w-full justify-start gap-2">
                        <Settings className="h-4 w-4" /> Chatbot Settings
                    </Button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className='p-4 border-b'>
                    <h2 className="text-xl font-bold font-headline tracking-tight">Chat with Sparky</h2>
                    <p className="text-sm text-muted-foreground">Your friendly AI business assistant.</p>
                </div>
                <ScrollArea className="flex-1 p-6" viewportRef={scrollViewportRef}>
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
                                <div className={cn("max-w-xl rounded-lg p-3", message.isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
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
                                    <p className="text-sm animate-pulse">Sparky is thinking...</p>
                                </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <div className="relative">
                        <Input
                            placeholder="Type your message to Sparky..."
                            className="pr-12"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
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
