'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore'

let firestoreInstance: Firestore | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      app = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  // Initialize Firestore with persistence if it hasn't been already.
  // This is structured to run only once.
  if (!firestoreInstance) {
      const db = getFirestore(app);
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log("Firestore offline persistence enabled.");
          firestoreInstance = db;
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn("Firestore offline persistence could not be enabled, multiple tabs open?");
          } else if (err.code === 'unimplemented') {
            console.log("Firestore offline persistence is not available in this browser.");
          }
          firestoreInstance = db; // Use non-persistent Firestore as a fallback
        });
  }


  return getSdks(app);
}

export function getSdks(firebaseApp: FirebaseApp) {
  // Ensure we wait for persistence to be enabled before returning the instance
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(firebaseApp);
  }
  
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestoreInstance
  };
}

// We initialize immediately to start the persistence setup
const { firebaseApp, auth, firestore } = initializeFirebase();

export { firebaseApp, auth, firestore };

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';