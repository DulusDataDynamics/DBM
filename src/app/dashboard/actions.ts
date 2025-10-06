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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function createTask(
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
  
  // Return the promise so the caller can still get the result if needed,
  // but handle the error here.
  return addDoc(tasksCollection, taskData)
    .then(docRef => ({ ...taskData, id: docRef.id }))
    .catch(serverError => {
      const contextualError = new FirestorePermissionError({
        path: tasksCollection.path,
        operation: 'create',
        requestResourceData: taskData
      });
      errorEmitter.emit('permission-error', contextualError);
      // Re-throw or handle as appropriate for the flow
      throw serverError;
    });
}

export async function listClients(userId: string) {
  const db = getFirestore(firebaseApp);
  const clientsCollection = collection(db, 'users', userId, 'clients');
  try {
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (serverError) {
      const contextualError = new FirestorePermissionError({
        path: clientsCollection.path,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', contextualError);
      throw serverError;
  }
}

export function createInvoice(
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
  
  return addDoc(invoicesCollection, invoiceData)
    .then(docRef => ({ ...invoiceData, id: docRef.id }))
    .catch(serverError => {
       const contextualError = new FirestorePermissionError({
        path: invoicesCollection.path,
        operation: 'create',
        requestResourceData: invoiceData
      });
      errorEmitter.emit('permission-error', contextualError);
      throw serverError;
    });
}
