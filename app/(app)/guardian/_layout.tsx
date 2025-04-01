import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function GuardianTabLayout() {
  const { colorScheme } = useColorScheme();

  return (
      <Tabs
        screenOptions={{
          headerShown: false,  // This removes the top header
          tabBarActiveTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
          tabBarInactiveTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
          tabBarStyle: {
            height: 75,
            paddingBottom: 5,
            paddingTop: 5,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
            borderTopColor: colorScheme === 'dark' ? Colors.light.border : Colors.dark.border,
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        }}
        
      >
        <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
        }} />
        <Tabs.Screen name="search" options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search-plus" size={20} color={color} />
          ),
        }} />
        <Tabs.Screen name="qanda" options={{
          title: 'Q&A',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="question-circle-o" size={20} color={color} />
          ),
        }} />
        <Tabs.Screen name="profile" options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={20} color={color} />
          ),
        }} />
      </Tabs>
  );
}
