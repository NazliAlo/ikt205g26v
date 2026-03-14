# FastNotes - React Native

FastNotes is a React Native note-taking app built with **Expo**. This document provides setup instructions, requirements, and steps to build the Android version of the app.

Github-repo link: https://github.com/NazliAlo/ikt205g26v.git
---

## Documentation

This README covers:  
- Project setup  
- Dependencies installation  
- Building the Android app  
- Running the app on physical devices or emulators  

---

## Requirements

Before running or building the app, ensure you have the following installed on your machine:

- **Node.js** (>=18.x recommended)  
- **npm** (comes with Node.js)  
- **Expo CLI** (`npm install -g expo-cli`)  
- **EAS CLI** (`npm install -g eas-cli`)  
- **Visual Studio Code** (or any preferred code editor)  
- **Android Studio** (for emulator)  
- **Physical Android device** (optional, if you want to test on a real device)  

---

## Project Setup

1. **Clone the project**  

```bash
git clone https://github.com/NazliAlo/ikt205g26v.git
```
2. **Navigate to the project folder**  

```bash
cd FastNotes_RN/FastNotes/
```
3. **Install dependencies**

```bash
npm install
```

## Building the Android App

1. **Start the Android build using EAS**

```bash
eas build --platform android --profile development
```

**Notes:**

- Build time may take 5–10 minutes.

- After the build completes, you will receive a link to download the APK.

- You can open this link in your web browser to install the app on your device.

## Running on Android
1. Using Android Emulator

    - Install Android Studio

    - Open AVD Manager (Android Virtual Device Manager)

    - Create a new emulator (recommended: Pixel 6 API 33)

    - Start the emulator

2. Using a Physical Android Device
- Via USB Cable

    - Enable Developer Options and USB Debugging on your Android device

    - Connect your device to your computer via USB 

- Wirelessly
    - Make sure your device and computer are on the same Wi-Fi network

    - Enable ADB over Wi-Fi in Developer Options
----

## Oppgavekrav

1. The Testing Suite (35%)
  - Unit Test - Opprettelse & Navigasjon (10%) ✅
  - Integration Test - Mocking & Loader (15%) ✅
  - Auth Guard Test - Tilgangskontroll (10%) ✅

2. Production Readiness & Optimization (40%)
- (10%) Log Cleanup ✅
- (10%) Resource Management - Kamera ✅
- Pagination (Skalering)
    - (10%) Endre logikken for henting av notater ✅
    - (10%) Implementer en "Last mer"-knapp ✅
3. Build & Dokumentasjon (25%)
- (10%) App Fil ✅
- (15%) Build-dokumentasjon (README) ✅


Total: 100%
----

