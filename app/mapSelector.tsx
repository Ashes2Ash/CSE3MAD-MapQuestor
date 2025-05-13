import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, FlatList } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { router } from 'expo-router';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

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
  );
};

function MapGrid({ children }: MapGridProps): JSX.Element {
  const userMaps = Array.isArray(children) ? children : [children];
  return (
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
      <View style={styles.title}>
        <Text>Select a map to edit!</Text>
      </View>

      {/* User Maps Grid */}
      <MapGrid>
        {maps.map((item) => (
          <MapTile key={item.id} uri={item.uri} onPress={item.onPress} title={item.title} />
        ))}
      </MapGrid>

      {/* Upload Button */}
      <View>
        <TouchableOpacity style={styles.testButton} onPress={() => router.push('/uploadMap')}>
          <Text style={{ color: 'white' }}>Upload New Map</Text>
        </TouchableOpacity>
      </View>

      {/* Shared Maps Search & List */}
      <View style={{ marginTop: 20 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shared maps..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredMaps}
          keyExtractor={(item) => item.id}
          renderItem={renderMapItem}
          ListHeaderComponent={<Text style={styles.header}>Shared Maps</Text>}
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity><Text>My Map</Text></TouchableOpacity>
        <TouchableOpacity><Text>Edit</Text></TouchableOpacity>
        <TouchableOpacity><Text>POIs</Text></TouchableOpacity>
        <TouchableOpacity><Text>Home</Text></TouchableOpacity>
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
  testButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#50546B',
    width: '50%',
    height: 30,
    marginTop: 12,
    alignSelf: 'center',
    borderRadius: 5,
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
});
