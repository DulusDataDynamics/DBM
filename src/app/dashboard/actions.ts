'use server';

import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { firebaseApp } from '@/firebase';
import { z } from 'zod';
import { InvoiceSchema } from '@/lib/data';

export async function createTask(
  userId: string,
  description: string,
  dueDate?: string
) {
  const db = getFirestore(firebaseApp);
  const tasksCollection = collection(db, 'users', userId, 'tasks');
  const taskData = {
    userId,
    description,
    dueDate: dueDate || new Date().toISOString(),
    completed: false,
  };
  const docRef = await addDoc(tasksCollection, taskData);
  return { ...taskData, id: docRef.id };
}

export async function listClients(userId: string) {
  const db = getFirestore(firebaseApp);
  const clientsCollection = collection(db, 'users', userId, 'clients');
  const snapshot = await getDocs(clientsCollection);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function createInvoice(
    userId: string,
    clientId: string,
    amount: number,
    dueDate?: string
): Promise<z.infer<typeof InvoiceSchema>> {
  const db = getFirestore(firebaseApp);
  const invoicesCollection = collection(db, 'users', userId, 'invoices');
  
  const invoiceData = {
    userId,
    clientId,
    amount,
    dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
    issueDate: new Date().toISOString(),
    status: 'unpaid' as const,
    invoiceNumber: `INV-${Date.now()}`,
    currency: 'zar', // Default currency, can be changed later
  };
  
  const docRef = await addDoc(invoicesCollection, invoiceData);
  
  return { ...invoiceData, id: docRef.id };
}
