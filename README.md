Here’s the complete `README.md` content in Markdown format:

````markdown
# React Native Bluetooth Low Energy App

This repository contains a React Native application for managing Bluetooth Low Energy (BLE) devices. It allows scanning, connecting, and interacting with BLE devices on Android.

---

## How to Use the App

### 1. Clone the Repository

Clone the app to your local machine:

```bash
git clone https://github.com/imammuhtadi/react-native-bluetooth-low-energy
cd react-native-bluetooth-low-energy
```
````

### 2. Add Required Permissions

Ensure the following permissions are added to your `AndroidManifest.xml` file for Bluetooth functionality:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
```

### 3. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 4. Run the App

To start the application on an Android device or emulator, use:

```bash
npx react-native run-android
```

---

## Using the Features in Your Project

If you only want to use the BLE features in your own project, you can copy the files from the `/src` folder into your project. Simply call the components or methods as needed.

### Example:

```javascript
import BLEComponent from './src/components/BLEComponent';

const App = () => {
  return <BLEComponent />;
};

export default App;
```

---

## Folder Structure

```
react-native-bluetooth-low-energy/
├── src/               # Core functionality for BLE interactions
│   ├── components/    # Reusable React components
│   ├── services/      # Business logic for BLE
│   ├── utils/         # Utility functions
├── android/           # Android native configuration
├── ios/               # iOS native configuration
├── package.json       # Project metadata
├── README.md          # Documentation
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```

You can copy this entire content into your `README.md` file. Let me know if there’s anything else you’d like to include!
```
