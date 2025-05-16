// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
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
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
const storage = getStorage(app);

// Function to save POI data with an image
export async function savePOIWithImage(poiData, imageFile) {
  try {
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `pois/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const poiDataWithImage = {
      ...poiData,
      imageUrl: imageUrl || null,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'pois'), poiDataWithImage);
    console.log("POI saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving POI with image: ", e);
    throw e;
  }
}

// Function to save Map data with an image
export async function saveMapWithImage(mapData, imageFile) {
  try {
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `maps/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const mapDataWithImage = {
      ...mapData,
      imageUrl: imageUrl || null,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'maps'), mapDataWithImage);
    console.log("Map saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving Map with image: ", e);
    throw e;
  }
}
