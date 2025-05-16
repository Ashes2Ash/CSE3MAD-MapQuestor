import React, {FC} from 'react'; //Imports react and Function Component
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'; //Imports building blocks for screen
import {useState,useEffect} from 'react'; //useState stores states of data. used in this to hold map lists from firebase. useEffect runs side loaded scripts at specific times 
import {auth,db} from '../firebaseConfig'; //auth allows us to confirm which user is logged in, db links to our firestore
import { router } from 'expo-router'; //redirects to other page in app
import {collection, getDocs, onSnapshot} from 'firebase/firestore'; //allows us to explore data collections and documents stored in firebase storage, used here to get map links for the tiles.
import { ScrollView } from 'react-native'

interface MapTileProps {
  uri: string;
  title: string;
  onPress: () => void;
  key?: React.Key;
}
type MapGridProps = {
  children: React.ReactElement[] | React.ReactElement;
}

const MapTile: FC<MapTileProps> = ({ uri, onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri }} style={{ width: 100, height: 100 }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}
function MapGrid({children}: MapGridProps): JSX.Element{
  const userMaps=Array.isArray(children) ? children:[children]
  return(
    <View style={styles.grid}>
      {userMaps.map((child, i) => (
        <View style={styles.tile} key={i}>
          {child}
        </View>
      ))}
    </View>
  );
}

export default function mapSelector() {
  const [maps, setMaps] = useState([] as {
    id: string;
    uri: string;
    title: string;
    onPress: () => void;
  }[]);

  const [sharedMaps, setSharedMaps] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load user-specific maps
  useEffect(() => {
    async function getMaps() {
      const user = auth.currentUser;
      if (!user) return;
      const uid = user.uid;
      const mapCollection = collection(db, `users/${uid}/maps`);
      const snapshot = await getDocs(mapCollection);
      const mapList = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          uri: data.imageURL,
          title: data.title,
          onPress: () => router.push({ pathname: '/MapEditor', params: { mapId: docSnap.id } }),
        };
      });
      setMaps(mapList);
    }
    getMaps();
  }, []);

  // Listen for shared maps (all users) in "maps" collection
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'maps'),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSharedMaps(list);
      },
      (error) => {
        console.error('Error loading shared maps:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredMaps = sharedMaps.filter((map) =>
    map.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMapItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mapItem}
      onPress={() => router.push({ pathname: '/MapEditor', params: { mapId: item.id } })}
    >
      <Text>{item.name || 'Unnamed Map'}</Text>
      <Text style={styles.shareText}>share</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.title}>
          <Text>Select a map to edit!</Text>
        </View>
        <MapGrid>
          {maps.map(item => (
            <MapTile
              key={item.id}
              uri={item.uri}
              onPress={item.onPress}
              title={item.title}
            />
          ))}
        </MapGrid>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={() => router.push('/uploadMap')}>
          <Text>Upload New Map</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  uploadButton: {
    justifyContent:'center',
    alignContent:'center',
    backgroundColor:'#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 150,
    height: 30,
    marginTop: 6
  },
  uploadButtonText:{
    textAlign:'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 2,
  },
  tile: {
    width: '48%',
    margin: '1%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  mapItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareText: {
    color: 'blue',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
  },
  tile:{
    justifyContent:'center',
    alignItems:'center',
    width:'23%',
    margin: '1%'
  },
  buttonContainer:{
    justifyContent:'center',
    alignItems:'center',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
    height:58,
    backgroundColor:"#fff",
    zIndex:1, //keeps on top of scroll content
    shadowColor:'#000', //This and following styles apply small shadow to floating button container
    shadowOffset:{width:0,height:-2},
    shadowOpacity:0.15,
    shadowRadius:4,
    elevation:8
  },
  scrollContent:{
    paddingBottom: 80
  }
});
