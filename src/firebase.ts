// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb4ZcXw6oSrkDtkNOAoZEkAuuBRDkdge0",
  authDomain: "vue-dashboard-a78fc.firebaseapp.com",
  projectId: "vue-dashboard-a78fc",
  storageBucket: "vue-dashboard-a78fc.appspot.com",
  messagingSenderId: "697284662493",
  appId: "1:697284662493:web:08196ee03054bbe6183734"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);
