// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyANzjv0NuhQLTWCQaQBEkPf4AQwyScIHZM",
  authDomain: "clanmatchstattracker.firebaseapp.com",
  projectId: "clanmatchstattracker",
  storageBucket: "clanmatchstattracker.appspot.com",
  messagingSenderId: "1035833787254",
  appId: "1:1035833787254:web:75028307cf3a91ca2f7057",
  measurementId: "G-363HRJCVLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };
