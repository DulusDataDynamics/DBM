'use client';
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

export { app, auth, db };
