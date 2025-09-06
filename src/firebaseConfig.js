// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9U779-_VHHqGizK1ieiKyNYvsy06V8g8",
  authDomain: "image-scanner-489eb.firebaseapp.com",
  projectId: "image-scanner-489eb",
  storageBucket: "image-scanner-489eb.firebasestorage.app",
  messagingSenderId: "325619374598",
  appId: "1:325619374598:web:86b4bb1bc858f8c00dc187",
  measurementId: "G-TYLPSCVW1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
