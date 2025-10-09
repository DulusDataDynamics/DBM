'use server';

import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  doc,
} from 'firebase/firestore';
import { firebaseApp } from '@/firebase/server-init';
import { z } from 'zod';
import { InvoiceSchema, TaskSchema, ClientSchema } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function createTask(
  userId: string,
  description: string,
  dueDate?: string
): Promise<z.infer<typeof TaskSchema>> {
  const db = getFirestore(firebaseApp);
  const tasksCollection = collection(db, 'users', userId, 'tasks');
  const taskData = {
    userId,
    description,
    dueDate: dueDate || new Date().toISOString(),
    completed: false,
  };
  
  try {
    const docRef = await addDoc(tasksCollection, taskData);
    return { ...taskData, id: docRef.id };
  } catch (serverError) {
    const contextualError = new FirestorePermissionError({
      path: tasksCollection.path,
      operation: 'create',
      requestResourceData: taskData
    });
    errorEmitter.emit('permission-error', contextualError);
    // Re-throw or handle as appropriate for the flow
    throw serverError;
  }
}

export async function listTasks(userId: string): Promise<z.infer<typeof TaskSchema>[]> {
    const db = getFirestore(firebaseApp);
    const tasksCollection = collection(db, 'users', userId, 'tasks');
    try {
        const snapshot = await getDocs(tasksCollection);
        return snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id }));
    } catch (serverError) {
        const contextualError = new FirestorePermissionError({
            path: tasksCollection.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', contextualError);
        throw serverError;
    }
}


export async function createClient(
    userId: string,
    name: string,
    email: string,
    phone: string,
    address: string
): Promise<z.infer<typeof ClientSchema>> {
    const db = getFirestore(firebaseApp);
    const clientsCollection = collection(db, 'users', userId, 'clients');
    const clientData = {
        userId,
        name,
        email,
        phone,
        address,
    };
    try {
        const docRef = await addDoc(clientsCollection, clientData);
        return { ...clientData, id: docRef.id };
    } catch (serverError) {
        const contextualError = new FirestorePermissionError({
            path: clientsCollection.path,
            operation: 'create',
            requestResourceData: clientData,
        });
        errorEmitter.emit('permission-error', contextualError);
        throw serverError;
    }
}


export async function listClients(userId: string): Promise<z.infer<typeof ClientSchema>[]> {
  const db = getFirestore(firebaseApp);
  const clientsCollection = collection(db, 'users', userId, 'clients');
  try {
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id }));
  } catch (serverError) {
      const contextualError = new FirestorePermissionError({
        path: clientsCollection.path,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', contextualError);
      throw serverError;
  }
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
  
  try {
    const docRef = await addDoc(invoicesCollection, invoiceData);
    return { ...invoiceData, id: docRef.id };
  } catch (serverError) {
     const contextualError = new FirestorePermissionError({
      path: invoicesCollection.path,
      operation: 'create',
      requestResourceData: invoiceData
    });
    errorEmitter.emit('permission-error', contextualError);
    throw serverError;
  }
}
