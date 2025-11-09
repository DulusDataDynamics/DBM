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


// Task functions
export const subscribeToTasks = (callback: (tasks: Task[]) => void) => subscribeToCollection<Task>('tasks', callback);
export const updateTaskCompletion = (id: string, completed: boolean) => {
    const taskDoc = doc(db, 'tasks', id);
    return updateDoc(taskDoc, { completed });
}


// Inventory functions
export const subscribeToInventory = (callback: (inventory: InventoryItem[]) => void) => subscribeToCollection<InventoryItem>('inventory', callback);
