'use client';
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import type { Settings } from "@/lib/data";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/textarea";


export default function SettingsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [businessName, setBusinessName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(undefined);
    
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [unlockPin, setUnlockPin] = useState('');

    const settingsDocRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}/settings/appSettings`);
    }, [firestore, user]);

    const { data: settings, isLoading } = useDoc<Settings>(settingsDocRef);
    
    useEffect(() => {
        if(settings) {
            setBusinessName(settings.businessName || '');
            setContactEmail(settings.contactEmail || '');
            setBusinessAddress(settings.businessAddress || '');
            setSelectedCurrency(settings.currency || 'zar');
        } else {
            setSelectedCurrency('zar');
        }
    }, [settings]);

    
    const logo = PlaceHolderImages.find(p => p.id === '7');
    
    const handleSaveChanges = () => {
        if (!settingsDocRef) return;
        const settingsData = {
          businessName,
          contactEmail,
          businessAddress,
          currency: selectedCurrency
        };
        // Use set with merge to create the document if it doesn't exist
        setDocumentNonBlocking(settingsDocRef, settingsData, { merge: true });
        toast({ title: "Settings Saved", description: "Your business and currency settings have been updated." });
    }
    
    const handleSetPin = () => {
        if (pin.length !== 6) {
            toast({ variant: "destructive", title: "Invalid PIN", description: "PIN must be 6 digits." });
            return;
        }
        if (pin !== confirmPin) {
            toast({ variant: "destructive", title: "PINs do not match", description: "Please ensure both PINs are the same." });
            return;
        }
        if (!settingsDocRef) return;
        updateDocumentNonBlocking(settingsDocRef, { invoiceLockPin: pin });
        toast({ title: "PIN Set", description: "Invoicing page is now locked." });
        setPin('');
        setConfirmPin('');
        document.getElementById('close-set-pin-dialog')?.click();
    }

    const handleRemovePin = () => {
        if (unlockPin !== settings?.invoiceLockPin) {
            toast({ variant: "destructive", title: "Incorrect PIN", description: "The PIN you entered is incorrect." });
            return;
        }
        if (!settingsDocRef) return;
        updateDocumentNonBlocking(settingsDocRef, { invoiceLockPin: "" });
        toast({ title: "PIN Removed", description: "Invoicing page is now unlocked." });
        setUnlockPin('');
        document.getElementById('close-remove-pin-dialog')?.click();
    }


    return (
        <>
            <PageHeader title="Settings" description="Manage your account and business preferences." />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Business Profile</CardTitle>
                        <CardDescription>Update your company's public information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Business Name</Label>
                                    <Input id="name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Dulus Inc." disabled={isLoading} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@dulus.com" disabled={isLoading}/>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Textarea id="address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="123 Innovation Drive, Tech City, 12345" disabled={isLoading} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="logo">Business Logo</Label>
                                <div className="flex items-center gap-4">
                                    {logo && 
                                        <Image
                                            alt="Company logo"
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={logo.imageUrl}
                                            width="64"
                                            data-ai-hint={logo.imageHint}
                                        />
                                    }
                                    <Input id="logo" type="file" className="w-auto" />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Financial Settings</CardTitle>
                        <CardDescription>Configure currency and payment details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-6">
                             <div className="grid gap-2">
                                <Label htmlFor="currency">Default Currency</Label>
                                <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={isLoading}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="zar">ZAR (R)</SelectItem>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                        <SelectItem value="gbp">GBP (£)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Manage access and security for your app.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="lock-invoices" className="text-base">Lock Invoicing Page</Label>
                                <p className="text-sm text-muted-foreground">
                                    {settings?.invoiceLockPin ? "Invoicing page is locked. " : "Set a 6-digit PIN to prevent unauthorized access to invoices."}
                                </p>
                            </div>
                             {settings?.invoiceLockPin ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" disabled={isLoading}>Disable Lock</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Disable Invoice Lock</DialogTitle>
                                            <DialogDescription>Enter your 6-digit PIN to unlock the invoicing page.</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center space-x-2">
                                            <InputOTP maxLength={6} value={unlockPin} onChange={setUnlockPin}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary" id="close-remove-pin-dialog">Cancel</Button>
                                            </DialogClose>
                                            <Button type="button" onClick={handleRemovePin}>Confirm</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                             ) : (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button disabled={isLoading}>Enable Lock</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Set Invoice Lock PIN</DialogTitle>
                                            <DialogDescription>Create a 6-digit PIN to lock the invoicing page.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Enter PIN</Label>
                                                <InputOTP maxLength={6} value={pin} onChange={setPin}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Confirm PIN</Label>
                                                <InputOTP maxLength={6} value={confirmPin} onChange={setConfirmPin}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary" id="close-set-pin-dialog">Cancel</Button>
                                            </DialogClose>
                                            <Button type="button" onClick={handleSetPin}>Set PIN</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                             )}
                        </div>
                    </CardContent>
                </Card>

                <Button onClick={handleSaveChanges} disabled={isLoading}>Save Changes</Button>
            </div>
        </>
    );
}
