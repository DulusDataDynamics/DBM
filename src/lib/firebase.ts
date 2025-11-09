// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-7996997189-78be3",
  "appId": "1:567409477647:web:846147bd1d96e51b467b7a",
  "apiKey": "AIzaSyBI6ZGvLdzW1k2_EgWDw0GU99HblD1L_cs",
  "authDomain": "studio-7996997189-78be3.firebaseapp.com",
  "storageBucket": "studio-7996997189-78be3.appspot.com"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  });


export { app, auth, db };
