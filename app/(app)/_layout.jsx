import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const { userData } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!userData) {
      router.replace("/login");
      return;
    }

    // If user has a role, redirect to the appropriate route
    if (userData?.role) {
      const role = userData.role.toLowerCase();

      switch (role) {
        case "student":
          console.log("STUDENT ROUTE")
          router.replace("/(app)/student");
          break;
        case "administrator":
          console.log("ADMINISTRATOR ROUTE")
          router.replace("/(app)/administrator");
          break;
        case "guardian":
          console.log("GUARDIAN ROUTE")
          router.replace("/(app)/guardian");
          break;
      }
    }
  }, [userData, router, isMounted]);

  if (!userData) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
      }}
    />
  );
}
