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
            {settingsSections.map((section) => (
            <TabsContent key={section.value} value={section.value} className="mt-0">
                <Card>
                <CardHeader>
                    <CardTitle>{section.label}</CardTitle>
                    <CardDescription>{section.content}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>
                    {section.label} settings will go here.
                    </p>
                </CardContent>
                </Card>
            </TabsContent>
            ))}
        </div>
      </Tabs>
    </div>
  );
}
