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
import { LogOut, Mic, PanelLeft, Search, Settings, User, Send, Moon, Sun } from 'lucide-react';
import { MainSidebar } from './sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from '@/firebase/auth-actions';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/chat-context';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function AppHeader({ onToggleSidebar, isSidebarOpen }: AppHeaderProps) {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const { addMessage } = useChat();
    const [isPending, startTransition] = useTransition();

    const [isRecording, setIsRecording] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isMicSupported, setIsMicSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) {
            setIsMicSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        
        recognition.onerror = (event: any) => {
            let errorMessage = 'An unknown voice recognition error occurred.';
            switch (event.error) {
                case 'not-allowed':
                case 'service-not-allowed':
                    errorMessage = 'Microphone permission denied. Please enable it in your browser settings.';
                    break;
                case 'no-speech':
                    errorMessage = "No speech was detected. Please try again.";
                    break;
                case 'audio-capture':
                    errorMessage = "Audio capture failed. Check if your microphone is working and not used by another app.";
                    break;
                case 'network':
                    errorMessage = 'A network error occurred during speech recognition.';
                    break;
            }
            toast({ title: "Voice recognition error", description: errorMessage, variant: "destructive" });
            setIsRecording(false);
        };
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            handleSend(transcript);
        };

        recognitionRef.current = recognition;
    }, [toast]);
    
    const handleMicClick = () => {
        if (!isMicSupported) {
           toast({ title: "Voice recognition not supported", description: "Your browser does not support voice recognition. Please use Google Chrome for this feature.", variant: "destructive" });
           return;
        }
        
        const recognition = recognitionRef.current;
        if (recognition) {
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Error starting speech recognition:", e);
                    toast({ title: "Voice recognition error", description: "Could not start voice recognition. Please ensure microphone permissions are granted.", variant: "destructive" });
                }
            }
        }
    };

    const handleSend = (text?: string) => {
        const command = text || inputValue;
        if (!command.trim() || !user) return;

        if (pathname !== '/dashboard/chatbot') {
            router.push('/dashboard/chatbot');
        }

        startTransition(() => {
            addMessage({ text: command, isUser: true }, true);
        });
        setInputValue('');
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
          <MainSidebar isOpen={true} />
        </SheetContent>
      </Sheet>
      <Button size="icon" variant="outline" className="hidden md:flex" onClick={onToggleSidebar}>
        <PanelLeft className={cn("h-5 w-5 transition-transform", !isSidebarOpen && "rotate-180")} />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="relative flex-1 ml-auto md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Send invoice to Keshav for R1200..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] pr-10"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isPending}
        />
        {inputValue ? (
             <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8" onClick={() => handleSend()} disabled={isPending}>
                <Send className="h-4 w-4" />
             </Button>
        ) : (
            <Button size="icon" variant="ghost" className={cn("absolute right-1 top-1 h-8 w-8", isRecording && "bg-red-500/20 text-red-500")} onClick={handleMicClick} disabled={!isMicSupported || isPending}>
                <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
            </Button>
        )}
      </div>
      <ThemeSwitcher />
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
          <DropdownMenuItem asChild><Link href="/dashboard/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/dashboard/settings" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut(auth)} className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
