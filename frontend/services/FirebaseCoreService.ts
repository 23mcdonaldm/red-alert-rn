import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import auth from "@react-native-firebase/auth";
import firestoreNative from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import {
  GOOGLE_WEB_CLIENT_ID,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID,
} from "@/config/config";

import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

class FirebaseCoreService {
  private static app: FirebaseApp | null = null;
  private static initialized = false;

  public static initialize() {
    if (FirebaseCoreService.initialized) return;

    if (isWeb) {
      FirebaseCoreService.app = initializeApp({
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        appId: FIREBASE_APP_ID,
      });
    } else {
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    }

    FirebaseCoreService.initialized = true;
  }

  public static getApp() {
    FirebaseCoreService.initialize();
    return FirebaseCoreService.app;
  }

  public static getAuth() {
    FirebaseCoreService.initialize();
    return isWeb ? getAuth() : auth();
  }

  public static getFirestore() {
    FirebaseCoreService.initialize();
    return isWeb ? getFirestore() : firestoreNative();
  }
}

export default FirebaseCoreService;
