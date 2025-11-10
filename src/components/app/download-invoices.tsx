'use client';

import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Mic } from 'lucide-react';
import { Invoice, Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Redefine types to match our app structure
type AppInvoice = Invoice & {
    client?: Client;
};

export default function DownloadInvoices() {
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // @ts-ignore - vendor prefix support
    const SpeechRecognition =
      (typeof window !== 'undefined' && (window as any).SpeechRecognition) ||
      (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
        console.warn("Speech recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      
      if (
        transcript.includes('download invoices') ||
        transcript.includes('download invoice') ||
        transcript.includes('all invoices') ||
        transcript.includes('download all invoices')
      ) {
        handleDownload();
      }
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
        if(e.error !== 'no-speech'){
            toast({
                variant: 'destructive',
                title: 'Voice Recognition Error',
                description: e.error,
            });
        }
        setListening(false);
    }

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore errors
      }
      recognitionRef.current = null;
    };
  }, [toast]);

  async function fetchInvoices(): Promise<AppInvoice[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Fetch all invoices
    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, orderBy('dueDate', 'desc'));
    const invoiceSnap = await getDocs(q);

    const invoicesData = invoiceSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Invoice, 'id'>),
    }));

    // Fetch associated clients
    const clientPromises = invoicesData.map(inv => {
        if (inv.clientId) {
            const clientRef = doc(db, "clients", inv.clientId);
            return getDoc(clientRef);
        }
        return Promise.resolve(null);
    });

    const clientSnaps = await Promise.all(clientPromises);
    const clientsMap = new Map(clientSnaps.filter(c => c?.exists()).map(c => [c!.id, {id: c!.id, ...c!.data()} as Client]));
    
    return invoicesData.map(inv => ({
        ...inv,
        client: clientsMap.get(inv.clientId),
    }));
  }

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  async function handleDownload() {
    setLoading(true);
    try {
      const invoices = await fetchInvoices();
      if (!invoices || invoices.length === 0) {
        toast({
            variant: "default",
            title: "No Invoices Found",
            description: "There are no invoices to download.",
        });
        setLoading(false);
        return;
      }

      generatePDF(invoices);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Failed to fetch invoices",
        description: err?.message || err,
      });
    } finally {
      setLoading(false);
    }
  }

  function generatePDF(invoices: AppInvoice[]) {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    const companyName = 'Dulus Business Manager';
    const companyEmail = 'dulusdatadynamics@gmail.com';
    const generatedDate = new Date().toLocaleString();

    // Title page/header on first page
    doc.setFontSize(18);
    doc.text(companyName, 40, 50);
    doc.setFontSize(10);
    doc.text(`Generated: ${generatedDate}`, 40, 68);
    doc.text(`Contact: ${companyEmail}`, 40, 84);

    doc.setFontSize(14);
    doc.text('All Invoices Summary', 40, 120);

    const tableColumns = [
      { header: 'Invoice ID', dataKey: 'id' },
      { header: 'Client', dataKey: 'client' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Due Date', dataKey: 'dueDate' },
      { header: 'Status', dataKey: 'status' },
    ];

    const tableRows = invoices.map((inv) => ({
      id: inv.id.substring(0, 8),
      client: inv.client?.name || inv.client?.email || 'N/A',
      amount: `R ${(inv.amount || 0).toFixed(2)}`,
      dueDate: formatDate(inv.dueDate),
      status: inv.status || '-',
    }));
    
    // @ts-ignore - jsPDF autoTable types
    (doc as any).autoTable({
      startY: 140,
      head: [tableColumns.map((c) => c.header)],
      body: tableRows.map((r) => [
        r.id,
        r.client,
        r.amount,
        r.dueDate,
        r.status,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 58, 138] }, // Tailwind blue-800
      theme: 'grid',
      margin: { left: 40, right: 40 },
    });
    
    invoices.forEach((inv) => {
      doc.addPage();
      doc.setFontSize(14);
      doc.text(`Invoice — ${inv.id.substring(0, 8)}`, 40, 50);

      doc.setFontSize(10);
      doc.text(companyName, 40, 72);
      doc.text(`Invoice ID: ${inv.id}`, 40, 88);
      
      doc.text(`Status: ${inv.status || 'Unknown'}`, 350, 72);
      doc.text(`Due Date: ${formatDate(inv.dueDate)}`, 350, 88);

      doc.setFontSize(11);
      doc.text('Bill To:', 40, 128);
      doc.setFontSize(10);
      doc.text(inv.client?.name || 'N/A', 40, 144);
      if (inv.client?.email) doc.text(inv.client.email, 40, 158);

      const cursorY = 220;
      doc.setFontSize(12);
      const totalAmount = inv.amount ? Number(inv.amount) : 0;
      doc.text(
        `Total: R ${totalAmount.toFixed(2)}`,
        doc.internal.pageSize.getWidth() - 40,
        cursorY,
        { align: 'right' }
      );
    });

    const fileName = `DBM_Invoices_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }

  function toggleListening() {
    const rec = recognitionRef.current;
    if (!rec) {
      toast({
          variant: "destructive",
          title: "Voice Recognition Not Supported",
          description: "Your browser does not support voice recognition.",
      });
      return;
    }
    try {
      if (listening) {
        rec.stop();
      } else {
        rec.start();
      }
    } catch (err) {
      console.error(err);
      toast({
          variant: "destructive",
          title: "Voice Recognition Error",
          description: "Could not start listening. Please check microphone permissions.",
      });
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Export Invoices</CardTitle>
            <CardDescription>
                Say “download invoices” or click the button to get a PDF.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 items-center">
                <Button onClick={handleDownload} disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? 'Preparing PDF...' : 'Download Invoices (PDF)'}
                </Button>

                {recognitionRef.current && (
                    <Button
                        onClick={toggleListening}
                        variant={listening ? 'secondary' : 'outline'}
                        size="icon"
                        aria-label="Toggle voice commands"
                        className={listening ? 'bg-primary/20 text-primary' : ''}
                    >
                        <Mic className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {recognitionRef.current && (
                 <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Note:</strong> Browser permission for the microphone is required to use voice commands.
                </div>
            )}
        </CardContent>
    </Card>
  );
}
