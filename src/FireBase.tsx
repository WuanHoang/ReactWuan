
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUYjrvl2wnzDJ3dAK4htfljlgkI_le7ds",
  authDomain: "chatapp-1de52.firebaseapp.com",
  projectId: "chatapp-1de52",
  storageBucket: "chatapp-1de52.appspot.com",
  messagingSenderId: "613096671061",
  appId: "1:613096671061:web:799801c150c5302b44d1dc",
  measurementId: "G-1PRCBMXXRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);