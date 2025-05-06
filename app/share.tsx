import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';

const ShareScreen: React.FC = () => {
  const [mapId] = useState<string>('sampleMapId'); 
  const router = useRouter();

  const handleBack = () => {
    router.push('/map-editor');
  };

  return (
    <View style={styles.container}>
      <QRCode value={`mapquestor://map/${mapId}`} size={200} />
      <Button title="Back" onPress={handleBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ShareScreen;
