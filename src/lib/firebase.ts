import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Автоматически заполнено на основе вашего google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyABNQyiD4-Sk7j6W5NtLWen-pGvMeESyAE",
  authDomain: "lumina-2882e.firebaseapp.com",
  projectId: "lumina-2882e",
  storageBucket: "lumina-2882e.firebasestorage.app",
  messagingSenderId: "524253422941",
  appId: "1:524253422941:android:d9f2b7f4151d5fd409b4b4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
