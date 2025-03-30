# omal-appdev

---

## ✅ How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Dev Client
This project uses native modules, so you **must run it using a Dev Client**, not Expo Go.

#### Android:
```bash
npx expo run:android
```

#### iOS:
```bash
npx expo run:ios
```

> ✅ Tip: If you haven’t already installed the Dev Client, follow Expo's [Custom Dev Client setup guide](https://docs.expo.dev/development/building-development-clients/).

---

## 🔐 Add Your Firebase and Google Config Keys

### 1. Create `config.js`
Create a file called `config.js` in the root of the project:

```js
// config.js

export const GOOGLE_WEB_CLIENT_ID = "YOUR_CLIENT_TYPE_3_CLIENT_ID.apps.googleusercontent.com";

export const FIREBASE_API_KEY = "YOUR_FIREBASE_API_KEY";
export const FIREBASE_AUTH_DOMAIN = "YOUR_AUTH_DOMAIN";
export const FIREBASE_PROJECT_ID = "YOUR_PROJECT_ID";
export const FIREBASE_APP_ID = "YOUR_FIREBASE_APP_ID";
```

### 2. Add Google Service Files
- Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → General
- Under **Your Apps**, select Android and iOS
- Download the config files:
  - For Android: download `google-services.json`
  - For iOS: download `GoogleService-Info.plist`

📥 **Drag and drop the files into your project**:
- `google-services.json` → Place it inside: `android/app/`
- `GoogleService-Info.plist` → Place it inside: `ios/YOUR_PROJECT_NAME/`

### 3. Get Config Values
- Open your `android/app/google-services.json`
  - Locate the `client_type: 3` section
  - Copy the `client_id` ending in `.apps.googleusercontent.com`
- Use that for `GOOGLE_WEB_CLIENT_ID`
- Go to **Firebase Console → Project Settings** for API Key & App ID

---

## ✅ Ready to Go
Once you've added your config and installed everything:

```bash
npx expo run:android # or ios
```