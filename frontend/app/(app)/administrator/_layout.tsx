import React from "react";
import { Entypo, AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function AdministratorLayout() {
  const navigationItems: NavigationItem[] = [
    {
      name: "qanda",
      icon: "chatbubbles-outline",
      filledIcon: "chatbubbles",
    },
    {
      name: "create",
      icon: "search-outline",
      filledIcon: "search",
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
      name: "create",
      title: "Create",
      iconComponent: ({ color }) => (
        <AntDesign
          name="pluscircleo"
          size={24}
          color={color}
        />
      ),
      icon: "create",
    },
    {
      name: "qanda",
      title: "Q&A",
      iconComponent: ({ color }) => (
        <AntDesign
          name="questioncircleo"
          size={24}
          color={color}
        />
      ),
      icon: "chatbubble-outline", // Fallback icon
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
