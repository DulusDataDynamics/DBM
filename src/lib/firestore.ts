'use client';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { Client, Invoice, Task, InventoryItem } from './types';

// Generic fetch function
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Client functions
export const getClients = () => fetchCollection<Client>('clients');
export const getClient = async (id: string) => {
  const docRef = doc(db, 'clients', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Client : null;
}

// Invoice functions
export const getInvoices = async (): Promise<Invoice[]> => {
  const invoicesSnap = await getDocs(collection(db, 'invoices'));
  const invoices = await Promise.all(invoicesSnap.docs.map(async (doc) => {
    const data = doc.data();
    const client = await getClient(data.clientId) as Client;
    return { id: doc.id, ...data, client } as Invoice;
  }));
  return invoices;
};

// Task functions
export const getTasks = () => fetchCollection<Task>('tasks');
export const updateTaskCompletion = (id: string, completed: boolean) => {
    const taskDoc = doc(db, 'tasks', id);
    return updateDoc(taskDoc, { completed });
}


// Inventory functions
export const getInventory = () => fetchCollection<InventoryItem>('inventory');

