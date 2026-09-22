package com.erp.nativemodules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BarcodeScannerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "BarcodeScanner"

    @ReactMethod
    fun scan(promise: Promise) {
        // The camera/SDK integration is injected by the Android host application.
        // Returning a typed error keeps the JavaScript contract explicit until it is wired.
        promise.reject("SCANNER_NOT_CONFIGURED", "Barcode scanner hardware is not configured")
    }
}
