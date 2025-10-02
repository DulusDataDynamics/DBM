'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { firebaseApp } from '@/firebase';

export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
    console.error("Anonymous sign-in failed", error);
  });
}

export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string, businessName: string): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
  const user = userCredential.user;
  if (user) {
    const db = getFirestore(firebaseApp);
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      businessName: businessName,
      createdAt: serverTimestamp(),
      settingsId: '', // You can populate this later
    });
  }
}

export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(authInstance, email, password);
}

export async function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authInstance, provider);
  const user = result.user;
  if (user) {
    const db = getFirestore(firebaseApp);
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      businessName: user.displayName || 'My Business', // Default business name
      createdAt: serverTimestamp(),
      settingsId: '',
    }, { merge: true }); // Merge to avoid overwriting existing data if user signs up differently
  }
}

export async function signOut(authInstance: Auth): Promise<void> {
  try {
    await firebaseSignOut(authInstance);
  } catch (error) {
    console.error("Sign-out failed", error);
    throw error;
  }
}
