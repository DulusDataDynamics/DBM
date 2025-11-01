'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateGoogleSignIn, sendPasswordReset } from '@/firebase/auth-actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const passwordResetSchema = z.object({
    resetEmail: z.string().email({ message: 'Please enter a valid email address.'})
})

const loadingMessages = [
    "Authenticating your credentials...",
    "Securing your session...",
    "Almost there...",
    "Getting things ready for you...",
];

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, values.email, values.password);
      router.push('/dashboard');
    } catch (error) {
      let description = "There was a problem with your request.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = "Invalid email or password. Please try again.";
        }
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description,
      });
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      router.push('/dashboard');
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Google Sign-in failed",
          description: "Could not sign in with Google. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const result = passwordResetSchema.safeParse({ resetEmail });
    if (!result.success) {
        toast({
            variant: "destructive",
            title: "Invalid Email",
            description: result.error.errors[0].message,
        });
        return;
    }
    
    try {
        await sendPasswordReset(auth, result.data.resetEmail);
        toast({
            title: "Password Reset Email Sent",
            description: `If an account exists for ${result.data.resetEmail}, you will receive an email with instructions.`,
        });
        setIsResetDialogOpen(false);
        setResetEmail('');
    } catch (error) {
        console.error("Password reset error:", error);
         toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not send password reset email. Please try again later.",
        });
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
                <Image src="/logo.svg" alt="Dulus BS Manager Logo" width={32} height={32} />
                <CardTitle className="text-2xl font-headline">Dulus BS Manager</CardTitle>
            </Link>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Carousel
                        plugins={[ Autoplay({ delay: 2000, stopOnInteraction: false }) ]}
                        opts={{ loop: true }}
                        className="w-full max-w-xs"
                    >
                        <CarouselContent>
                            {loadingMessages.map((message, index) => (
                                <CarouselItem key={index}>
                                    <p className="text-center text-sm text-muted-foreground">{message}</p>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="link" type="button" className="ml-auto inline-block text-sm underline p-0 h-auto">
                                            Forgot your password?
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Forgot Password?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Enter your email address below and we'll send you a link to reset your password.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="grid gap-2">
                                            <Label htmlFor="reset-email">Email</Label>
                                            <Input 
                                                id="reset-email" 
                                                type="email" 
                                                placeholder="m@example.com" 
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                            />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                                <FormControl>
                                <Input id="password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                            Login with Google
                        </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline">
                        Sign up
                        </Link>
                    </div>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
