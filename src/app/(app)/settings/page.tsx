'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  User,
  Building,
  Users,
  CreditCard,
  Palette,
  Puzzle,
  Database,
  ShieldCheck,
  LifeBuoy,
  Code,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const settingsSections = [
  { value: 'profile', label: 'Business Profile', icon: Building, content: 'Manage your business details and branding.' },
  { value: 'invoicing', label: 'Invoicing', icon: FileText, content: 'Customize your invoice settings and appearance.' },
  { value: 'team', label: 'Team & Roles', icon: Users, content: 'Control who has access and what they can do.' },
  { value: 'billing', label: 'Billing & Subscription', icon: CreditCard, content: 'Manage your subscription plan and payment methods.' },
  { value: 'preferences', label: 'App Preferences', icon: Palette, content: 'Personalize how the app looks and works.' },
  { value: 'integrations', label: 'Integrations', icon: Puzzle, content: 'Connect to other tools and services.' },
  { value: 'data', label: 'Reports & Data', icon: Database, content: 'Handle data safely with import/export options.' },
  { value: 'security', label: 'Security & Access', icon: ShieldCheck, content: 'Protect your account with advanced security settings.' },
  { value: 'support', label: 'Support & Feedback', icon: LifeBuoy, content: 'Get help and provide feedback.' },
  { value: 'developer', label: 'Developer', icon: Code, content: 'Access developer tools and API settings.' },
];

export default function SettingsPage() {
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, company, and application preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col gap-6 md:flex-row" orientation="vertical">
        <TabsList className="flex h-full flex-shrink-0 flex-row justify-start overflow-x-auto p-1 md:flex-col md:overflow-x-visible">
          {settingsSections.map((section) => (
            <TabsTrigger
              key={section.value}
              value={section.value}
              className="w-full justify-start gap-2 whitespace-nowrap px-3 py-2 text-left"
            >
              <section.icon className="h-4 w-4" />
              <span>{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="w-full">
            <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                      <CardTitle>Business Profile</CardTitle>
                      <CardDescription>This information will automatically appear on all your invoices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                     {/* Business Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Business Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Business / Company Name</Label>
                                <Input id="company-name" defaultValue="Dulus Data Dynamics" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner-name">Owner / Contact Person</Label>
                                <Input id="owner-name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business-email">Business Email</Label>
                                <Input id="business-email" type="email" defaultValue="contact@dulus.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="business-phone">Business Phone Number</Label>
                                <Input id="business-phone" type="tel" placeholder="+27 74 646 1288" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="business-address">Business Address</Label>
                            <Input id="business-address" placeholder="Street, City, Postal Code, Country" />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (optional)</Label>
                                <Input id="website" placeholder="https://dulus.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fax">Fax (optional)</Label>
                                <Input id="fax" placeholder="Fax number" />
                            </div>
                        </div>
                    </div>
                    <Separator />
                     {/* Financial & Legal Information */}
                    <div className="space-y-4">
                       <h3 className="text-lg font-medium">Financial & Legal Information</h3>
                       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                           <div className="space-y-2">
                                <Label htmlFor="tax-number">Tax / VAT Number</Label>
                                <Input id="tax-number" placeholder="Enter VAT number" />
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="bank-name">Bank Name</Label>
                                <Input id="bank-name" placeholder="e.g. FNB" />
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="account-holder">Account Holder Name</Label>
                                <Input id="account-holder" placeholder="e.g. Dulus Data Dynamics (Pty) Ltd" />
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="account-number">Account Number</Label>
                                <Input id="account-number" placeholder="e.g. 62900001234" />
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="branch-code">Branch Code / SWIFT Code</Label>
                                <Input id="branch-code" placeholder="e.g. 250655" />
                           </div>
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                      <Button>Save Business Profile</Button>
                  </CardFooter>
                </Card>
            </TabsContent>

             <TabsContent value="invoicing" className="mt-0">
                <Card>
                  <CardHeader>
                      <CardTitle>Invoicing Settings</CardTitle>
                      <CardDescription>Customize the appearance and default settings for your invoices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                     {/* Branding */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Branding</h3>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20 rounded-md">
                                {companyLogoPreview ? (
                                <AvatarImage src={companyLogoPreview} alt="Company Logo" className="object-contain" />
                                ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted">
                                    <Building className="h-10 w-10 text-muted-foreground" />
                                </div>
                                )}
                            </Avatar>
                            <div className="space-y-2">
                                <Label htmlFor="company-logo">Company Logo</Label>
                                <Input id="company-logo" type="file" className="max-w-sm" onChange={(e) => handleFileChange(e, setCompanyLogoPreview)} accept="image/*" />
                                <p className="text-xs text-muted-foreground">PNG, JPG, SVG. Recommended: 200x80px.</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                                {signaturePreview ? (
                                <img src={signaturePreview} alt="Signature" className="object-contain h-full w-full" />
                                ) : (
                                <p className="text-xs text-muted-foreground">Signature</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signature-image">Signature Image (optional)</Label>
                                <Input id="signature-image" type="file" className="max-w-sm" onChange={(e) => handleFileChange(e, setSignaturePreview)} accept="image/png, image/jpeg" />
                                <p className="text-xs text-muted-foreground">Upload a transparent PNG for best results.</p>
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <Label htmlFor="brand-color">Brand Color</Label>
                            <div className="relative">
                                <Input id="brand-color" defaultValue="#2B579A" className="pr-10" />
                                <input type="color" defaultValue="#2B579A" className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer appearance-none border-none bg-transparent p-0" />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    {/* Invoice Contact Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Invoice Contact Details</h3>
                        <p className="text-sm text-muted-foreground">Displayed at the bottom of each invoice for client queries.</p>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="invoice-contact-name">Contact Person Name</Label>
                                <Input id="invoice-contact-name" placeholder="e.g. Accounts Department" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="invoice-contact-email">Contact Email</Label>
                                <Input id="invoice-contact-email" type="email" placeholder="e.g. accounts@dulus.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="invoice-contact-phone">Contact Phone Number</Label>
                                <Input id="invoice-contact-phone" type="tel" placeholder="e.g. 0800 123 4567" />
                            </div>
                        </div>
                    </div>
                     <Separator />
                    {/* Invoice Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Invoice Generation</h3>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                                <Input id="invoice-prefix" placeholder="e.g. INV-" defaultValue="INV-" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="default-due-days">Default Due Days</Label>
                                <Input id="default-due-days" type="number" placeholder="e.g. 30" defaultValue="30" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment-terms">Default Payment Terms</Label>
                             <Textarea id="payment-terms" placeholder="e.g. Payment due within 30 days." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="footer-message">Footer Message</Label>
                             <Textarea id="footer-message" placeholder="e.g. Thank you for your business!" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="show-watermark">Show DBM Watermark</Label>
                                <p className="text-xs text-muted-foreground">Display "Generated by Dulus Business Manager" on invoices.</p>
                            </div>
                            <Switch id="show-watermark" defaultChecked={true} />
                        </div>
                    </div>

                  </CardContent>
                   <CardFooter className="justify-end">
                      <Button>Save Invoice Settings</Button>
                  </CardFooter>
                </Card>
            </TabsContent>

            {settingsSections.filter(s => !['profile', 'invoicing'].includes(s.value)).map((section) => (
              <TabsContent key={section.value} value={section.value} className="mt-0">
                  <Card>
                  <CardHeader>
                      <CardTitle>{section.label}</CardTitle>
                      <CardDescription>{section.content}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center">
                          <p className="text-muted-foreground">{section.label} settings will be available here soon.</p>
                      </div>
                  </CardContent>
                  </Card>
              </TabsContent>
            ))}
        </div>
      </Tabs>
    </div>
  );
}
