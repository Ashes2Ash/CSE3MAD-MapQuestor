import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

const ShareScreen: React.FC = () => {
  const [mapId] = useState<string>('sampleMapId'); // Replace with dynamic mapId
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const dynamicMapId = params.mapId as string || mapId;

  // Initialize NFC Manager
  useEffect(() => {
    const initNfc = async () => {
      try {
        const supported = await NfcManager.isSupported();
        setNfcSupported(supported);
        if (supported) {
          await NfcManager.start();
        }
      } catch (error) {
        console.error('NFC initialization failed:', error);
      }
    };
    initNfc();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  // Write NFC Tag
  const writeNFC = async () => {
    if (!nfcSupported) {
      Alert.alert('Error', 'NFC is not supported on this device.');
      return;
    }

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const mapUrl = `mapquestor://map/${dynamicMapId}`;
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(mapUrl)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Success', 'Map URL written to NFC tag!');
      } else {
        Alert.alert('Error', 'Failed to encode NDEF message.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to write to NFC tag.');
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const handleBack = () => {
    router.push('/map-editor');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Map</Text>
      <Text style={styles.subtitle}>Scan the QR Code:</Text>
      <QRCode value={`mapquestor://map/${dynamicMapId}`} size={200} />
      {nfcSupported && Platform.OS !== 'web' && (
        <>
          <Text style={styles.subtitle}>Or use NFC:</Text>
          <Button title="Write to NFC Tag" onPress={writeNFC} />
          <Text style={styles.instructions}>
            Tap an NFC-enabled device or tag to share the map.
          </Text>
        </>
      )}
      <View style={styles.button}>
        <Button title="Back" onPress={handleBack} />
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default ShareScreen;
