import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import SharedLayout from "@/components/SharedLayout";

type NavigationItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  filledIcon: keyof typeof Ionicons.glyphMap;
};

type RightAction = {
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: boolean;
  onPress: (navigation: NavigationProp<any>) => void;
  customComponent?: React.ReactNode;
};

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconComponent?: React.ComponentType<{ color: string }>;
};

export default function FreelancerLayout() {
  const navigationItems: NavigationItem[] = [
    {
      name: "forum",
      icon: "chatbubbles-outline",
      filledIcon: "chatbubbles",
    },
    {
      name: "map",
      icon: "map-outline",
      filledIcon: "map",
    },
  ];

  const rightActions: RightAction[] = [
    {
      icon: "notifications-outline",
      badge: true,
      onPress: (navigation: NavigationProp<any>) =>
        navigation.navigate("notifications"),
    },
    {
      icon: "person",
      onPress: (navigation: NavigationProp<any>) =>
        navigation.navigate("profile"),
    },
  ];

  const tabConfigs: TabConfig[] = [
    {
      name: "index",
      title: "Home",
      icon: "home-outline",
    },
    {
      name: "map",
      title: "Map",
      icon: "map-outline",
    },
    {
      name: "forum",
      title: "Forum",
      icon: "chatbubble-outline",
    },
  ];

  const hiddenScreens = ["profile", "notifications"];

  return (
    <SharedLayout
      navigationItems={navigationItems}
      rightActions={rightActions}
      tabConfigs={tabConfigs}
      hiddenScreens={hiddenScreens}
    />
  );
}
