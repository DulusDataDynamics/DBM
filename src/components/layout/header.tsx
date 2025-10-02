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
import { Bot, LogOut, Mic, PanelLeft, Search, Settings, User } from 'lucide-react';
import { MainSidebar } from './sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from '@/firebase/auth-actions';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { cn } from '@/lib/utils';

export function AppHeader() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleSignOut = async () => {
      await signOut(auth);
      router.push('/');
    };

    const handleMicClick = async () => {
        if (isRecording) {
            setIsRecording(false);
            // In a real app, you would stop recording and process the audio.
            // For now, we'll simulate processing and generate a voice response.
            try {
                const response = await textToSpeech("I'm sorry, I can't do that yet, but I'm learning!");
                setAudioUrl(response.media);
                if (audioRef.current) {
                    audioRef.current.play();
                }
            } catch (error) {
                console.error("Error generating speech:", error);
            }

        } else {
            setIsRecording(true);
            // In a real app, you'd start recording user's voice here.
        }
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
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
        <Button size="icon" variant="ghost" className={cn("absolute right-1 top-1 h-8 w-8", isRecording && "bg-red-500/20 text-red-500")} onClick={handleMicClick}>
            <Mic className="h-4 w-4" />
        </Button>
        {audioUrl && <audio ref={audioRef} src={audioUrl} />}
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
          <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2"><LogOut /> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
