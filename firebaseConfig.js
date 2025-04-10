// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtQcAzYQcu8DDT8qmhvljh-PzCq4GVCJU",
  authDomain: "mapquestor-e1b1f.firebaseapp.com",
  projectId: "mapquestor-e1b1f",
  storageBucket: "mapquestor-e1b1f.firebasestorage.app",
  messagingSenderId: "1098540494948",
  appId: "1:1098540494948:web:e7378e0443380c30c62f71",
  measurementId: "G-PNX7CNLDGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);