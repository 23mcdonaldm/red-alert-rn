import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, Stack, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { RootState } from "@/types/common";
import { View, StatusBar } from "react-native";

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const { userData } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark
    ? Colors.dark.background
    : Colors.light.background;


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !userData) return;

    if (!userData.role) {
      router.replace("/");
    }

    const currentRole = userData.role?.toLowerCase();
    const currentSegment = segments[1];

    if (currentRole && currentSegment && currentSegment !== currentRole) {
      router.replace(`/(app)/${currentRole}` as any);
    }
  }, [userData, router, isMounted, segments]);


  if (!userData) return null;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={backgroundColor}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent", // since View already has bg
          },
        }}
      />
    </View>
  )
}