// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
export const db = getFirestore(app); 
const analytics = getAnalytics(app);
export const auth = getAuth(app); 
const storage = getStorage(app); // Initialize Storage

// Function to save POI data with an image
export async function savePOIWithImage(poiData, imageFile) {
  try {
    // Step 1: Upload the image to Firebase Storage
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `pois/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Step 2: Add the image URL to the POI data
    const poiDataWithImage = {
      ...poiData,
      imageUrl: imageUrl || null, // Add image URL (or null if no image)
      createdAt: new Date()
    };

    // Step 3: Save the POI data to Firestore
    const docRef = await addDoc(collection(db, 'pois'), poiDataWithImage);
    console.log("POI saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving POI with image: ", e);
    throw e;
  }
}
