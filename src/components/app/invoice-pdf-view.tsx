'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Invoice, BusinessProfile, InvoiceSettings } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { getBusinessProfile, getInvoiceSettings } from '@/lib/firestore';

interface InvoicePDFViewProps {
  invoice: Invoice;
}

export function InvoicePDFView({ invoice }: InvoicePDFViewProps) {
    const { user } = useAuth();
    const [profile, setProfile] = useState<BusinessProfile | null>(null);
    const [settings, setSettings] = useState<InvoiceSettings | null>(null);
    
    useEffect(() => {
        if(user?.uid) {
            getBusinessProfile(user.uid).then(setProfile);
            getInvoiceSettings(user.uid).then(setSettings);
        }
    }, [user]);

  const brandColor = settings?.brandColor || '#000000';

  const DetailRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="flex justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );

  return (
    <div id={`invoice-pdf-view-${invoice.id}`} className="p-8 bg-background text-foreground rounded-lg border">
        <header className="grid grid-cols-2 gap-8 pb-8">
            <div>
                 <h1 className="text-2xl font-bold" style={{ color: brandColor }}>
                    {profile?.companyName || "Your Company"}
                 </h1>
                <p className="text-xs text-muted-foreground">{profile?.businessAddress}</p>
                <p className="text-xs text-muted-foreground">{profile?.businessEmail}</p>
                <p className="text-xs text-muted-foreground">{profile?.businessPhone}</p>
                {profile?.taxNumber && <p className="text-xs text-muted-foreground">Tax No: {profile.taxNumber}</p>}
            </div>
             <div className="text-right">
                <h2 className="text-3xl font-bold tracking-tight">INVOICE</h2>
                <DetailRow label="Invoice #" value={`${settings?.invoicePrefix || 'INV-'}${invoice.id.substring(0,6).toUpperCase()}`} />
                <DetailRow label="Date" value={new Date().toLocaleDateString()} />
                <DetailRow label="Due Date" value={new Date(invoice.dueDate).toLocaleDateString()} />
             </div>
        </header>
        <Separator />
        <section className="py-8">
            <h3 className="font-semibold text-sm mb-2">BILL TO</h3>
            <p className="font-medium">{invoice.client?.name}</p>
            <p className="text-sm text-muted-foreground">{invoice.client?.email}</p>
        </section>

        <section>
            <div className="rounded-lg border">
                <div className="flex justify-between font-semibold p-3 bg-muted/50 border-b">
                    <p>Description</p>
                    <p>Amount</p>
                </div>
                <div className="flex justify-between p-3">
                    <p>Services Rendered / Product</p>
                    <p>R {invoice.amount.toLocaleString()}</p>
                </div>
            </div>
        </section>

        <section className="flex justify-end py-8">
            <div className="w-full max-w-xs space-y-2">
                <DetailRow label="Subtotal" value={`R ${invoice.amount.toLocaleString()}`} />
                <Separator />
                <div className="flex justify-between">
                    <p className="text-base font-bold">Total</p>
                    <p className="text-base font-bold">R {invoice.amount.toLocaleString()}</p>
                </div>
                <Badge
                    variant={
                        invoice.status === 'Paid' ? 'default' :
                        invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                    }
                    className={`
                        w-full justify-center mt-2
                        ${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''}
                    `}
                >
                    {invoice.status}
                </Badge>
            </div>
        </section>

        <Separator />
        
        <footer className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div>
                 <h4 className="font-semibold mb-2">Payment Details</h4>
                 <p>Bank: {profile?.bankName}</p>
                 <p>Account Name: {profile?.accountHolder}</p>
                 <p>Account Number: {profile?.accountNumber}</p>
                 <p>Branch Code: {profile?.branchCode}</p>
            </div>
             <div className="space-y-1">
                 <h4 className="font-semibold">Thank You!</h4>
                 <p className="text-muted-foreground">{settings?.paymentTerms}</p>
                 <p className="text-muted-foreground">{settings?.footerMessage}</p>
             </div>
        </footer>
        {settings?.showWatermark && (
            <p className="text-center text-xs text-muted-foreground/50 pt-8">
                Generated by Dulus Business Manager
            </p>
        )}
    </div>
  );
}
