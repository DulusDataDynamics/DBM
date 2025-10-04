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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import type { Settings } from "@/lib/data";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function SettingsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const settingsDocRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}/settings/invoiceSettings`);
    }, [firestore, user]);

    const { data: settings } = useDoc<Settings>(settingsDocRef);
    
    const logo = PlaceHolderImages.find(p => p.id === '7');

    const handleLockToggle = (isLocked: boolean) => {
        if (!settingsDocRef) return;
        updateDocumentNonBlocking(settingsDocRef, { invoicePageLocked: isLocked });
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
                                    <Input id="name" defaultValue="Dulus Inc." />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input id="email" type="email" defaultValue="contact@dulus.com" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Textarea id="address" defaultValue="123 Innovation Drive, Tech City, 12345" />
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
                                <Label htmlFor="currency">Currency</Label>
                                <Select defaultValue="usd">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                        <SelectItem value="gbp">GBP (£)</SelectItem>
                                        <SelectItem value="zar">ZAR (R)</SelectItem>
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
                                    Prevent any edits or creation of new invoices.
                                </p>
                            </div>
                            <Switch
                                id="lock-invoices"
                                checked={settings?.invoicePageLocked || false}
                                onCheckedChange={handleLockToggle}
                            />
                        </div>
                    </CardContent>
                </Card>


                <Button>Save Changes</Button>
            </div>
        </>
    );
}
