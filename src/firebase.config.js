// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC0Xo-vJzn2Ji3j0C3QZcvQhYMg0Dz4p5U",
  authDomain: "mister-great.firebaseapp.com",
  projectId: "mister-great",
  storageBucket: "mister-great.appspot.com",
  messagingSenderId: "822030212769",
  appId: "1:822030212769:web:ac48a9cd4c3c70ee961ae0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
