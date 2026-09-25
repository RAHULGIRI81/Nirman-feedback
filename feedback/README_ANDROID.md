# Amrita Nirman Feedback — Android Mobile App

The feedback portal has been converted into a native Android application using Capacitor with full mobile device enhancements (Hardware Back button support, Status bar customization, Splash screen, Auto-save state persistence, and native share sheet).

---

## 📱 Generated APK Location
Your compiled debug APK is ready at:
`feedback/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 Quick Build Commands (from `feedback` directory)

### 1. Build and Compile Android APK
```powershell
npm run android:build
```
*This packages the web assets into `www/`, syncs them into the Android project, and compiles `app-debug.apk`.*

### 2. Sync Web UI changes to Android
```powershell
npm run android:sync
```

### 3. Open Project in Android Studio
```powershell
npm run android:open
```
*(Or open the `feedback/android` folder directly in Android Studio).*

### 4. Install APK directly onto Connected Android Phone
```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🛠️ Building a Release Signed APK / AAB (for Google Play)

1. Open the project in Android Studio:
   ```powershell
   npm run android:open
   ```
2. In Android Studio, go to menu: **Build > Generate Signed Bundle / APK...**
3. Select **Android App Bundle** (for Google Play Store) or **APK** (for direct release distribution).
4. Create/Select your Keystore and click **Release**.
