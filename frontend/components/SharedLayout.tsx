import React from "react";
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import NavigationHeader from "@/components/NavigationHeader";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { NavigationProp } from "@react-navigation/native";

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

type SharedLayoutProps = {
  navigationItems: NavigationItem[];
  rightActions: RightAction[];
  tabConfigs: TabConfig[];
  hiddenScreens?: string[];
};

export default function SharedLayout({
  navigationItems,
  rightActions,
  tabConfigs,
  hiddenScreens = [],
}: SharedLayoutProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const getActiveRouteName = (route: { name: string }) => {
    return route.name === "index" ? "home" : route.name;
  };

  if (Platform.OS !== "web") {
    return (
      <Tabs
        screenOptions={{
          header: ({ navigation, route }) => (
            <NavigationHeader
              navigation={navigation}
              currentRoute={route.name}
              logoSource={require("@/assets/images/omal-logo.png")}
              navigationItems={[]} // Empty since we're using Tabs
              rightActions={rightActions}
            />
          ),
          animation: "fade",
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
        {tabConfigs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) =>
                tab.iconComponent ? (
                  <tab.iconComponent color={color} />
                ) : (
                  <Ionicons name={tab.icon} size={24} color={color} />
                ),
            }}
          />
        ))}
        {hiddenScreens.map((screen) => (
          <Tabs.Screen
            key={screen}
            name={screen}
            options={{
              href: null, // Hides from bottom tabs
            }}
          />
        ))}
      </Tabs>
    );
  }

  return (
    <Stack
      screenOptions={{
        header: ({ navigation, route }) => (
          <NavigationHeader
            navigation={navigation}
            currentRoute={route.name}
            logoSource={require("@/assets/images/omal-logo.png")}
            navigationItems={navigationItems}
            rightActions={rightActions}
          />
        ),
        animation: "fade",
      }}
    >
      {tabConfigs.map((tab) => (
        <Stack.Screen
          key={tab.name}
          name={tab.name}
          options={{ headerShown: true, headerTitle: "" }}
        />
      ))}
      {hiddenScreens.map((screen) => (
        <Stack.Screen
          key={screen}
          name={screen}
          options={{ headerShown: true, headerTitle: "" }}
        />
      ))}
    </Stack>
  );
} 