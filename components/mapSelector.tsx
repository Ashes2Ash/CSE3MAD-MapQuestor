import { savePOI } from '../scripts/firestoreUtils.js';

const poiData = {
  name: "Central Park",
  latitude: 40.7829,
  longitude: -73.9654,
  category: "Park",
  description: "A large public park in New York City",
  createdAt: new Date()
};

async function handleSavePOI() {
  try {
    const poiId = await savePOI(poiData);
    alert(`POI saved successfully with ID: ${poiId}`);
  } catch (error) {
    alert("Failed to save POI: " + (error instanceof Error ? error.message : String(error)));
  }
}
