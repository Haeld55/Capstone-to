// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "laundry-c95d2.firebaseapp.com",
  projectId: "laundry-c95d2",
  storageBucket: "laundry-c95d2.appspot.com",
  messagingSenderId: "941636805885",
  appId: "1:941636805885:web:65d7b4821e94b7d5fa0a94",
  measurementId: "G-0WQBZ01C62"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);