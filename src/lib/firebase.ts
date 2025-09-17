import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyA6zEKkoTfis02VQWtyUwJYr0igDEmIqto",
  authDomain: "homeoftreasures-53401.firebaseapp.com",
  projectId: "homeoftreasures-53401",
  storageBucket: "homeoftreasures-53401.firebasestorage.app",
  messagingSenderId: "321596479074",
  appId: "1:321596479074:web:79342d80f8dbacb797e33b",
  measurementId: "G-WZCTQB56VB"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Check if auth domain is properly configured
if (typeof window !== 'undefined' && !firebaseConfig.authDomain) {
  console.error('Firebase Auth Domain is not configured. Authentication will not work correctly.');
}


export default app;
