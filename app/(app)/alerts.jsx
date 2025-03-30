import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function AlertsScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor:
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background,
      }}
    >
      <View className="flex-1 justify-center items-center">
        <Text
          className="text-2xl font-bold"
          style={{
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        >
          Alerts Screen
        </Text>
      </View>
    </SafeAreaView>
  );
} 