'use client';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  addDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { Client, Invoice, Task, InventoryItem } from './types';

// Generic fetch function for real-time updates
function subscribeToCollection<T>(collectionName: string, callback: (data: T[]) => void): () => void {
  const collectionRef = collection(db, collectionName);
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  });
  return unsubscribe;
}


// Client functions
export const subscribeToClients = (callback: (clients: Client[]) => void) => subscribeToCollection<Client>('clients', callback);
export const getClient = async (id: string) => {
  const docRef = doc(db, 'clients', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Client : null;
}
export const saveClient = async (id: string | undefined, data: Omit<Client, 'id'>) => {
  if (id) {
    const clientDoc = doc(db, 'clients', id);
    return await updateDoc(clientDoc, data);
  } else {
    return await addDoc(collection(db, 'clients'), data);
  }
}
export const deleteClient = async (id: string) => {
    const clientDoc = doc(db, 'clients', id);
    return await deleteDoc(clientDoc);
}


// Invoice functions
export const subscribeToInvoices = (callback: (invoices: Invoice[]) => void): () => void => {
  const invoicesRef = collection(db, 'invoices');
  
  // Keep a map of clients to avoid re-fetching
  const clientsMap = new Map<string, Client>();

  const unsubInvoices = onSnapshot(invoicesRef, async (invoiceSnapshot) => {
    const invoicesPromises = invoiceSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      let client = clientsMap.get(data.clientId);
      
      if (!client) {
        const clientDoc = await getClient(data.clientId);
        if (clientDoc) {
          client = clientDoc;
          clientsMap.set(data.clientId, client);
        }
      }
      
      return { id: doc.id, ...data, client } as Invoice;
    });
    const invoices = await Promise.all(invoicesPromises);
    callback(invoices);
  });

  return () => {
    unsubInvoices();
  };
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
    const docRef = doc(db, 'invoices', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    const client = await getClient(data.clientId);

    return { id: docSnap.id, ...data, client } as Invoice;
}

export const saveInvoice = async (id: string | undefined, data: Omit<Invoice, 'id' | 'client'>) => {
  if (id) {
    const invoiceDoc = doc(db, 'invoices', id);
    return await updateDoc(invoiceDoc, data);
  } else {
    return await addDoc(collection(db, 'invoices'), data);
  }
}

export const deleteInvoice = async (id: string) => {
    const invoiceDoc = doc(db, 'invoices', id);
    return await deleteDoc(invoiceDoc);
}


// Task functions
export const subscribeToTasks = (callback: (tasks: Task[]) => void) => subscribeToCollection<Task>('tasks', callback);
export const updateTaskCompletion = (id: string, completed: boolean) => {
    const taskDoc = doc(db, 'tasks', id);
    return updateDoc(taskDoc, { completed });
}


// Inventory functions
export const subscribeToInventory = (callback: (inventory: InventoryItem[]) => void) => subscribeToCollection<InventoryItem>('inventory', callback);
