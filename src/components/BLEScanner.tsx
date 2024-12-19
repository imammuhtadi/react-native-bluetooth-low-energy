import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { BLEScannerModule, Device } from '../modules/BLEScannerModule';

const BLEScannerComponent: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsubscribe = BLEScannerModule.addListener(setDevices);
    return unsubscribe;
  }, []);

  const startScan = async () => {
    await BLEScannerModule.startScan();
    setIsScanning(true);
  };

  const stopScan = async () => {
    await BLEScannerModule.stopScan();
    setIsScanning(false);
  };

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name || 'Unknown Device'}</Text>
      <Text>Address: {item.address}</Text>
      {item.rssi && <Text>RSSI: {item.rssi}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title={isScanning ? 'Stop Scan' : 'Start Scan'}
        onPress={isScanning ? stopScan : startScan}
      />
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.address}
        ListEmptyComponent={<Text style={styles.emptyList}>No devices found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  item: {
    backgroundColor: '#E0E0E0',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default BLEScannerComponent;

