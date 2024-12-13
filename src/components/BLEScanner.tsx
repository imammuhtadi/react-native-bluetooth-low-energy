import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BLEManager } from '../services/BLEManager';
import { Peripheral } from '../models/Peripheral';
import Toast from 'react-native-toast-message';

const bleManager = new BLEManager();

export const BLEScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeBLE = async () => {
      try {
        await bleManager.initializeBleManager();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize BLE:', error);
        Alert.alert('Error', 'Failed to initialize Bluetooth. Please restart the app.');
      }
    };

    initializeBLE();

    const unsubscribe = bleManager.addListener((event, _) => {
      switch (event) {
        case 'scanStart':
          setIsScanning(true);
          Toast.show({
            type: 'info',
            text1: 'Scanning started',
            position: 'bottom',
          });
          break;
        case 'scanStop':
          setIsScanning(false);
          Toast.show({
            type: 'info',
            text1: 'Scanning stopped',
            position: 'bottom',
          });
          break;
        case 'peripheralDiscovered':
          setPeripherals(bleManager.getPeripherals());
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const startScan = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'BLE is not initialized yet. Please wait or restart the app.');
      return;
    }
    await bleManager.startScan();
  };

  const stopScan = () => {
    bleManager.stopScan();
  };

  const terminateScan = () => {
    if (isScanning) {
      bleManager.stopScan();
      Toast.show({
        type: 'success',
        text1: 'Scan terminated',
        position: 'bottom',
      });
    }
  };

  const renderItem = ({ item }: { item: Peripheral }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>ID: {item.id}</Text>
      <Text>RSSI: {item.rssi}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>BLE Scanner</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isScanning ? 'Stop Scan' : 'Start Scan'}
          onPress={isScanning ? stopScan : startScan}
          disabled={!isInitialized}
        />
        <Button
          title="Terminate Scan"
          onPress={terminateScan}
          disabled={!isScanning}
          color="red"
        />
      </View>
      {isScanning && <ActivityIndicator style={styles.spinner} />}
      <FlatList
        data={peripherals}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyList}>No devices found</Text>}
      />
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 20,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

