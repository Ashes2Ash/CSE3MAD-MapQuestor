import { db } from './firebaseConfig.js'; 
import { collection, addDoc } from 'firebase/firestore';

export async function savePOI(poiData) {
  try {
    const docRef = await addDoc(collection(db, 'pois'), poiData);
    console.log("POI saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving POI: ", e);
    throw e;
  }
}
