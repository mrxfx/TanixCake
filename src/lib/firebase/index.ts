import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfigData from '../../../firebase-applet-config.json';

// Combine auto-generated config with any environment fallbacks
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfigData.authDomain || (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigData.projectId || (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfigData.storageBucket || (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigData.messagingSenderId || (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigData.appId || (import.meta as any).env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId || (import.meta as any).env.VITE_FIREBASE_DATABASE_ID || '(default)'
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId from configuration
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');

// Enable IndexedDB offline persistence to avoid "client is offline" errors in browser sandbox
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn('Firestore offline persistence failed:', err.code);
  });
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
