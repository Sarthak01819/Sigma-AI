// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRREBASE_API_KEY,
  authDomain: "sigma-ai-af37e.firebaseapp.com",
  projectId: "sigma-ai-af37e",
  storageBucket: "sigma-ai-af37e.firebasestorage.app",
  messagingSenderId: "170279913295",
  appId: "1:170279913295:web:a964ec2db97fa08e56673a",
  measurementId: "G-ED461PP3XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 