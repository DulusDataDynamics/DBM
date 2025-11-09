'use client';

import {
  Card,
  CardContent,
  CardDescription,
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

const settingsSections = [
  { value: 'profile', label: 'Profile', icon: User, content: 'Manage your personal account information.' },
  { value: 'company', label: 'Company', icon: Building, content: 'Manage your business details and branding.' },
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
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Manage your personal account information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://picsum.photos/seed/avatar/200" alt="User Avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Label htmlFor="profile-picture">Profile Picture</Label>
                        <Input id="profile-picture" type="file" className="max-w-sm" />
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB.</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Current User" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="user@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Manager" disabled />
                      </div>
                    </div>
                     <Separator />
                     <div className="space-y-4">
                       <h3 className="text-lg font-medium">Security</h3>
                       <div className="flex items-center justify-between rounded-lg border p-4">
                         <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Update your password to a new one.</p>
                         </div>
                         <Button variant="outline">Change Password</Button>
                       </div>
                     </div>
                  </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="company" className="mt-0">
                <Card>
                  <CardHeader>
                      <CardTitle>Company Settings</CardTitle>
                      <CardDescription>Manage your business details and branding.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-muted">
                        <Building className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-logo">Company Logo</Label>
                        <Input id="company-logo" type="file" className="max-w-sm" />
                        <p className="text-xs text-muted-foreground">PNG, JPG, SVG. Recommended size: 200x80px.</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" defaultValue="Dulus Data Dynamics" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-contact">Contact Email</Label>
                          <Input id="company-contact" type="email" defaultValue="contact@dulus.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Company Address</Label>
                      <Input id="company-address" placeholder="123 Business Rd, Suite 100, Business City, 12345" />
                    </div>
                    <Separator />
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="ZAR">
                                <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="tax-number">Tax Number / VAT</Label>
                            <Input id="tax-number" placeholder="Enter your VAT number" />
                        </div>
                     </div>
                  </CardContent>
                </Card>
            </TabsContent>

            {settingsSections.filter(s => s.value !== 'profile' && s.value !== 'company').map((section) => (
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
