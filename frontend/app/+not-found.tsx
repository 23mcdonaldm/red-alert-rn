import React from "react";
import { Stack, Link } from "expo-router";
import { View, Text, Image } from "react-native";
import { Colors, Brand } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-8" style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }}>
        <Image
          source={require("../assets/images/ra-logo.png")}
          style={{ width: 120, height: 120, marginBottom: 32 }}
        />
        <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-3xl font-bold text-center mb-4">
          Page Not Found
        </Text>
        <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link href="/" className="mt-4 py-4 px-8 rounded-xl" style={{ backgroundColor: Brand.primary }}>
          <Text className="text-white font-bold text-lg">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
