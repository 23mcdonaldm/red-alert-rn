import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
        screenOptions={{
          headerShown: false,  // This removes the top header
          tabBarActiveTintColor: '#E61F27',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 70,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        }}>
        <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
        }} />
        <Tabs.Screen name="map" options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map" size={20} color={color} />
          ),
        }} />
      </Tabs>
  );
}
