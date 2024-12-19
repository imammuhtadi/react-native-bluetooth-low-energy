package com.bleapp

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BLEScannerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private val bluetoothLeScanner: BluetoothLeScanner? = bluetoothAdapter?.bluetoothLeScanner
    private val scannedDevices = mutableListOf<BluetoothDevice>()

    override fun getName() = "BLEScanner"

    @ReactMethod
    fun startScan(promise: Promise) {
        if (bluetoothLeScanner == null) {
            promise.reject("BLE_NOT_SUPPORTED", "Bluetooth LE is not supported on this device")
            return
        }

        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Location permission is required for BLE scanning")
            return
        }

        scannedDevices.clear()
        bluetoothLeScanner.startScan(scanCallback)
        promise.resolve(null)
    }

    @ReactMethod
    fun stopScan(promise: Promise) {
        if (bluetoothLeScanner == null) {
            promise.reject("BLE_NOT_SUPPORTED", "Bluetooth LE is not supported on this device")
            return
        }

        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Location permission is required for BLE scanning")
            return
        }

        bluetoothLeScanner.stopScan(scanCallback)
        promise.resolve(null)
    }

    @ReactMethod
    fun getScannedDevices(promise: Promise) {
        val deviceArray = Arguments.createArray()
        scannedDevices.forEach { device ->
            val deviceMap = Arguments.createMap().apply {
                putString("name", device.name)
                putString("address", device.address)
            }
            deviceArray.pushMap(deviceMap)
        }
        promise.resolve(deviceArray)
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            if (device !in scannedDevices) {
                scannedDevices.add(device)
                val params = Arguments.createMap().apply {
                    putString("name", device.name)
                    putString("address", device.address)
                    putInt("rssi", result.rssi)
                }
                sendEvent("onDeviceFound", params)
            }
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

