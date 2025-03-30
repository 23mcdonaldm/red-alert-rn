import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";

import { getAuth } from "firebase/auth";
import auth from "@react-native-firebase/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "../global.css";
import { Platform, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { initializeFirebase } from "../config/firebaseConfig";
import { configureGoogleSignIn } from "../config/googleSignInConfig";
import { login, logout } from "@/store/slices/authSlice";
import ThemeSwitcher from "@/components/ThemeSwitcher";

SplashScreen.preventAutoHideAsync();

export default function ReduxLayout() {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  const [initializing, setInitializing] = useState(true);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const isReady = loaded && !initializing;

  useEffect(() => {
    if (Platform.OS === "web") {
      initializeFirebase();
    } else {
      configureGoogleSignIn();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const onAuthStateChanged = (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          login({
            uid: firebaseUser.uid || "",
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName | "Unknown User",
            photoURL: firebaseUser.photoURL || "",
            role: null,
          })
        );
      } else {
        dispatch(logout());
      }

      if (initializing) setInitializing(false);
    };

    const unsubscribe =
      Platform.OS === "web"
        ? getAuth().onAuthStateChanged(onAuthStateChanged)
        : auth().onAuthStateChanged(onAuthStateChanged);

    return unsubscribe;
  }, [dispatch, initializing]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userData && !inAuthGroup) {
      router.replace("/login");
    } else if (userData && inAuthGroup) {
      router.replace("/");
    }
  }, [userData, segments, isReady]);

  if (!isReady) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#11181C",
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <SafeAreaView className="absolute bottom-4 right-4">
        <ThemeSwitcher />
      </SafeAreaView>
    </>
  );
}
