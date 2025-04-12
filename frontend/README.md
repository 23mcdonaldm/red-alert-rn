# RED ALERT V3!

## Prerequisites

Before getting started, ensure you have:

- [Node.js](https://nodejs.org/) installed (LTS version recommended)
- Basic knowledge of React Native
- An active Firebase project
- For iOS development:
  - macOS with Xcode 15.2+ (requires macOS 13.5+ / Ventura)
  - CocoaPods installed
- For Android development:
  - Android Studio installed
  - JDK 17 configured

## ✅ Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

#### A. Create Service Account Files

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings → General
2. Under **Your Apps**, download the config files:
   - For Android: download `google-services.json`
   - For iOS: download `GoogleService-Info.plist`

3. Place these files in their respective locations:
   - `google-services.json` → `/`
   - `GoogleService-Info.plist` → `/`

4. After placing the files, run:
   ```bash
   npx expo prebuild --clean
   ```

#### B. Environment Configuration

Create a `.env` file in your project root with the following values:

```env
GOOGLE_WEB_CLIENT_ID=YOUR_CLIENT_TYPE_3_CLIENT_ID.apps.googleusercontent.com
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

These values will be automatically loaded into your app through the `config/config.ts` file.

#### C. Get SHA-1 Key for Android Firebase

For Android, you need to configure SHA-1 key in your Firebase project:

```bash
# Using EAS for production and development builds
npx eas credentials

# Follow the prompts:
# 1. Select "Android"
# 2. Choose your project
# 3. Select "Keystore" or "Build credentials"
# 4. View the SHA-1 and SHA-256 values
```

Alternatively, for local debug keystore:
```bash
cd android
./gradlew signingReport
```

Add the SHA-1 hash to your Firebase project:
1. Go to Firebase Console → Project Settings → Your Android App
2. Click "Add fingerprint" at the bottom of the page
3. For development builds:
   - If using EAS development builds, use the SHA-1 from EAS credentials
   - If using local builds, use the SHA-1 from your debug keystore
4. For production builds:
   - Use the SHA-1 from your upload keystore via EAS credentials
5. After adding the fingerprint, download the updated `google-services.json` file and replace it in your project

### 3. Run the Project

This project uses native modules, so you **must run it using a Dev Client**, not Expo Go.

#### iOS Setup:

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

#### Android Setup:

```bash
npx expo run:android
```

> **Note**: If you've previously installed a development build before adding Firebase, you must uninstall it first and rebuild with `npx expo prebuild --clean` to include the native Firebase modules.

## 🔧 Troubleshooting

### Java Version Issues (Android)

If you encounter Java version errors during Android builds:

1. Install JDK 17 using Homebrew:
   ```bash
   brew install openjdk@17
   ```

2. Set JAVA_HOME environment variable (macOS/Linux):
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17
   ```

3. Add it to your shell profile (.zshrc, .bashrc, etc.) to make it persistent:
   ```bash
   echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
   source ~/.zshrc
   ```

### Firebase Module Not Found

If you get errors like "RNFBAppModule not found", ensure:

1. You've correctly installed the Firebase modules:
   ```bash
   npx expo install @react-native-firebase/app
   ```

2. You've configured the plugins in app.json:
   ```json
   "plugins": [
     "@react-native-firebase/app",
     "other-firebase-modules"
   ]
   ```

3. Rebuild the native projects:
   ```bash
   npx expo prebuild --clean
   ```

### iOS Build Issues

For iOS, ensure you're using static frameworks:

In app.json, add:
```json
"plugins": [
  [
    "expo-build-properties",
    {
      "ios": {
        "useFrameworks": "static"
      }
    }
  ]
]
```

## 📚 Additional Resources

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Expo Development Build Documentation](https://docs.expo.dev/development/build/)
- [Firebase Console](https://console.firebase.google.com/)