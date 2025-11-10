'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Invoice } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface ViewInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function ViewInvoiceDialog({ isOpen, onClose, invoice }: ViewInvoiceDialogProps) {

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-center py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-right">{value}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            A read-only view of invoice {invoice?.id.substring(0, 8)}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            {invoice ? (
                <>
                <DetailRow label="Client Name" value={invoice.client?.name || 'N/A'} />
                <DetailRow label="Client Email" value={invoice.client?.email || 'N/A'} />
                <Separator />
                <DetailRow label="Amount" value={`R${invoice.amount.toLocaleString()}`} />
                <DetailRow label="Due Date" value={new Date(invoice.dueDate).toLocaleDateString()} />
                <DetailRow label="Status" value={
                    <Badge 
                        variant={
                        invoice.status === 'Paid' ? 'default' : 
                        invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                        }
                        className={
                        invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''
                        }
                    >
                        {invoice.status}
                    </Badge>
                } />
                </>
            ) : (
                <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                     <Separator />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
