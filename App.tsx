import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BLEScannerComponent  from './src/components/BLEScanner';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <SafeAreaProvider>
      <BLEScannerComponent />
      <Toast />
    </SafeAreaProvider>
  );
}

