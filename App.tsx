import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BLEScanner } from './src/components/BLEScanner';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <SafeAreaProvider>
      <BLEScanner />
      <Toast />
    </SafeAreaProvider>
  );
}

