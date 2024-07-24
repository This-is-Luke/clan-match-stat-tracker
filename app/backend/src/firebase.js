// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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