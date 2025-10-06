'use client';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User as UserIcon, Settings, MessageSquarePlus, History, ImageIcon, Star } from "lucide-react";
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useChat, type Message } from '@/context/chat-context';

export default function ChatbotPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const { messages, isLoading, addMessage, clearMessages, commandIsLoading } = useChat();
    const [input, setInput] = useState('');
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (input.trim() === '') return;
        const text = input;
        setInput('');
        await addMessage({ text, isUser: true });
    };
    
    const handleNewChat = () => {
        clearMessages();
        toast({
            title: "New Chat",
            description: "Conversation history has been cleared.",
        });
    }

    const handleHistoryClick = (topic: string) => {
        clearMessages();
        addMessage({ text: `This is a past conversation about ${topic}.`, isUser: false });
        toast({
            title: "History Loaded",
            description: "Full chat history coming soon!",
        });
    }

    const handleFutureFeatureClick = (featureName: string) => {
        toast({
            title: "Coming Soon!",
            description: `${featureName} functionality is currently under development.`,
        });
    }

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

    const isProcessing = isLoading || commandIsLoading;

    return (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-8rem)] gap-6">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-4 border-r pr-6">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleNewChat}>
                    <MessageSquarePlus className="h-4 w-4" /> New Chat
                </Button>
                <Separator />
                <h3 className="text-sm font-semibold text-muted-foreground px-2">History</h3>
                <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-2">
                        <Button variant="ghost" className="w-full justify-start gap-2 truncate" onClick={() => handleHistoryClick('sales')}>
                            <History className="h-4 w-4" /> Initial chat about sales
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 truncate" onClick={() => handleHistoryClick('invoicing')}>
                            <History className="h-4 w-4" /> Invoicing questions
                        </Button>
                    </div>
                </ScrollArea>
                <Separator />
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleFutureFeatureClick('Image analysis')}>
                        <ImageIcon className="h-4 w-4" /> Images
                    </Button>
                     <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleFutureFeatureClick('Client review generation')}>
                        <Star className="h-4 w-4" /> Client Reviews
                    </Button>
                     <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleFutureFeatureClick('Chatbot settings')}>
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
                        {messages.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="bg-primary/10 p-4 rounded-full mb-4">
                                     <Bot className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Start a conversation</h3>
                                <p className="text-muted-foreground">Ask me anything about your business or give me a command!</p>
                            </div>
                        )}
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
                         {isProcessing && (
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
                            onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
                            disabled={isProcessing}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleSend}
                            disabled={isProcessing || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
