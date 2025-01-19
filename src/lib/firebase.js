// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatterstream-8a180.firebaseapp.com",
  projectId: "chatterstream-8a180",
  storageBucket: "chatterstream-8a180.appspot.com",
  messagingSenderId: "996787461429",
  appId: "1:996787461429:web:2e20192f41674dc0a0807c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore();
export const storage=getStorage();