import {BleManager} from 'react-native-ble-plx';
import {Peripheral} from '../models/Peripheral';
import {Platform, PermissionsAndroid} from 'react-native';

export class BLEManager {
  private bleManager: BleManager | null = null;
  private peripherals: Map<string, Peripheral> = new Map();
  private isScanning: boolean = false;
  private listeners: Set<(event: string, data?: any) => void> = new Set();

  constructor() {
    this.initializeBleManager();
  }

  public async initializeBleManager() {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const location = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const bluetooth = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires bluetooth access',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          location !== PermissionsAndroid.RESULTS.GRANTED &&
          bluetooth !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Location or bluetooth permission denied');
          return;
        }
      }

      this.bleManager = new BleManager();
      console.log('BLE Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize BLE Manager:', error);
    }
  }

  addListener(callback: (event: string, data?: any) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(event: string, data?: any) {
    this.listeners.forEach(listener => listener(event, data));
  }

  async startScan(): Promise<void> {
    if (!this.bleManager) {
      console.error('BLE Manager not initialized');
      return;
    }

    if (this.isScanning) {
      console.log('Scanning is already in progress');
      return;
    }

    this.isScanning = true;
    this.peripherals.clear();
    this.notifyListeners('scanStart');

    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        this.stopScan();
        return;
      }

      if (device) {
        const peripheral = new Peripheral(
          device.id,
          device.name || 'Unknown',
          device.rssi || 0,
          device.manufacturerData,
        );
        this.peripherals.set(device.id, peripheral);
        this.notifyListeners('peripheralDiscovered', peripheral);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => this.stopScan(), 10000);
  }

  stopScan(): void {
    if (!this.bleManager) {
      console.error('BLE Manager not initialized');
      return;
    }

    if (!this.isScanning) {
      console.log('No scan in progress');
      return;
    }

    this.bleManager.stopDeviceScan();
    this.isScanning = false;
    this.notifyListeners('scanStop');
  }

  getPeripherals(): Peripheral[] {
    return Array.from(this.peripherals.values());
  }

  getPeripheral(id: string): Peripheral | undefined {
    return this.peripherals.get(id);
  }
}
