import React from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { getAuth, User as WebUser } from "firebase/auth";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import "../global.css";
import { Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/useToast";
import { RootState } from "@/types/common";
import AuthService from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@app_theme";

SplashScreen.preventAutoHideAsync();

export default function ReduxLayout() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const { showToast } = useToast();
  const [initializing, setInitializing] = useState(true);
  const { colorScheme, setColorScheme } = useColorScheme();

  // Load saved theme on initial mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        if (Platform.OS === "web") {
          const savedTheme = localStorage.getItem(THEME_KEY);
          if (savedTheme) {
            setColorScheme(savedTheme as "light" | "dark" | "system");
          }
        } else {
          const savedTheme = await AsyncStorage.getItem(THEME_KEY);
          if (savedTheme) {
            setColorScheme(savedTheme as "light" | "dark" | "system");
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadSavedTheme();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [layoutMounted, setLayoutMounted] = useState(false);

  const isReady = loaded && !initializing;

  useEffect(() => {
    setLayoutMounted(true);
    return () => setLayoutMounted(false);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const onAuthStateChanged = async (
      firebaseUser: WebUser | FirebaseAuthTypes.User | null
    ) => {
      if (firebaseUser) {
        try {
          const userData = await AuthService.getUserData(firebaseUser);
          dispatch(login(userData));
        } catch (err) {
          showToast("error", "Error checking/creating Firestore user");
        }
      } else {
        dispatch(logout());
      }

      if (initializing) setInitializing(false);
    };

    const unsubscribe =
      Platform.OS === "web"
        ? getAuth().onAuthStateChanged(
            onAuthStateChanged as (user: WebUser | null) => void
          )
        : auth().onAuthStateChanged(
            onAuthStateChanged as (user: FirebaseAuthTypes.User | null) => void
          );

    return unsubscribe;
  }, [dispatch, initializing]);

  useEffect(() => {
    if (!isReady || !layoutMounted) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userData && !inAuthGroup) {
      const redirectTimer = setTimeout(() => {
        router.replace("/(auth)/login" as any);
      }, 100);

      return () => clearTimeout(redirectTimer);
    } else if (userData && inAuthGroup) {
      const redirectTimer = setTimeout(() => {
        router.replace("/(app)" as any);
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [userData, segments, isReady, layoutMounted]);

  if (!isReady) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#11181C" : "#fff",
          },
          headerTintColor: colorScheme === "dark" ? "#fff" : "#11181C",
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
