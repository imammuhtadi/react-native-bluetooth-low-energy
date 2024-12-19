import {NativeModules, NativeEventEmitter} from 'react-native';

const {BLEScanner} = NativeModules;
const bleEmitter = new NativeEventEmitter(BLEScanner);

export interface Device {
  name: string;
  address: string;
  rssi?: number;
}

class BLEScannerModuleClass {
  private isScanning: boolean = false;
  private devices: Device[] = [];
  private listeners: Set<(devices: Device[]) => void> = new Set();

  constructor() {
    bleEmitter.addListener('onDeviceFound', this.onDeviceFound);
  }

  private onDeviceFound = (device: Device) => {
    if (!this.devices.some(d => d.address === device.address)) {
      this.devices.push(device);
      this.notifyListeners();
    }
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.devices]));
  }

  addListener(callback: (devices: Device[]) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  async startScan(): Promise<void> {
    if (this.isScanning) {
      return;
    }
    try {
      await BLEScanner.startScan();
      this.isScanning = true;
      this.devices = [];
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to start scan:', error);
    }
  }

  async stopScan(): Promise<void> {
    if (!this.isScanning) {
      return;
    }
    try {
      await BLEScanner.stopScan();
      this.isScanning = false;
    } catch (error) {
      console.error('Failed to stop scan:', error);
    }
  }

  getIsScanning(): boolean {
    return this.isScanning;
  }

  getDevices(): Device[] {
    return [...this.devices];
  }
}

export const BLEScannerModule = new BLEScannerModuleClass();
