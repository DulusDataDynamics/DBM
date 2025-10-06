'use server';

import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { z } from 'zod';
import { firebaseApp } from '@/firebase';

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  dueDate: z.string(),
  completed: z.boolean(),
});

export const ClientSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

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
