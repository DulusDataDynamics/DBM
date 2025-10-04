'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Mic, PanelLeft, Search, Settings, User, Send } from 'lucide-react';
import { MainSidebar } from './sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from '@/firebase/auth-actions';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AppHeader() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [isRecording, setIsRecording] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onend = () => {
                setIsRecording(false);
                recognitionRef.current = null;
            };

            recognition.onerror = (event: any) => {
                let errorMessage = event.error;
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                  errorMessage = 'Microphone permission denied. Please enable it in your browser settings.';
                }
                toast({ title: "Voice recognition error", description: errorMessage, variant: "destructive" });
                setIsRecording(false);
            };
            
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                // Automatically send after successful recognition
                handleSend(transcript);
            };
            recognitionRef.current = recognition;
        }
    }, [toast]);
    
    const handleMicClick = () => {
      const recognition = recognitionRef.current;
      if (recognition && !isRecording) {
        try {
          recognition.start();
        } catch (e) {
          toast({ title: "Voice recognition error", description: "Could not start voice recognition.", variant: "destructive" });
        }
      } else if (!recognition) {
         toast({ title: "Voice recognition not supported", description: "Please use Google Chrome for voice commands.", variant: "destructive" });
      }
    };

    const handleSend = async (text?: string) => {
        const command = text || inputValue;
        if (!command.trim()) return;

        // In a real app, you would send the command to your AI for processing.
        console.log("Sending to AI:", command);
        toast({
          title: "Command Sent",
          description: `Your command "${command}" is being processed.`
        });
        setInputValue(''); // Clear input after sending
    };

    const userAvatar = user?.photoURL;
    const userFallback = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0">
          <MainSidebar />
        </SheetContent>
      </Sheet>
      <div className="relative flex-1 ml-auto md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Send invoice to John for R1200..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] pr-10"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        {inputValue ? (
             <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8" onClick={() => handleSend()}>
                <Send className="h-4 w-4" />
             </Button>
        ) : (
            <Button size="icon" variant="ghost" className={cn("absolute right-1 top-1 h-8 w-8", isRecording && "bg-red-500/20 text-red-500")} onClick={handleMicClick}>
                <Mic className="h-4 w-4" />
            </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
                {userAvatar && <AvatarImage src={userAvatar} alt="User Avatar" />}
                <AvatarFallback>{userFallback.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/dashboard/settings" className="flex items-center gap-2"><Settings /> Settings</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="#" className="flex items-center gap-2"><User /> Profile</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="flex items-center gap-2"><LogOut /> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
