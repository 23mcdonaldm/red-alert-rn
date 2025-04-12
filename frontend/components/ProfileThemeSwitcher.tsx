import React, { useEffect } from "react";
import { Platform, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";

const THEME_KEY = "@app_theme";

const ProfileThemeSwitcher = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const progress = useSharedValue(colorScheme === "dark" ? 1 : 0);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      if (Platform.OS === "web") {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as "light" | "dark" | "system");
          progress.value = savedTheme === "dark" ? 1 : 0;
        }
      } else {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as "light" | "dark" | "system");
          progress.value = savedTheme === "dark" ? 1 : 0;
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = colorScheme === "light" ? "dark" : "light";
    progress.value = withSpring(newTheme === "dark" ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
    });

    try {
      if (Platform.OS === "web") {
        localStorage.setItem(THEME_KEY, newTheme);
      } else {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      }
      setColorScheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const switchStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.backgroundTertiary, Colors.dark.backgroundTertiary]
    ),
  }));

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(progress.value * 20, {
          mass: 1,
          damping: 15,
          stiffness: 120,
        }),
      },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.primary, Colors.dark.primary]
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: withSpring(1, { damping: 15 }),
    transform: [
      {
        rotate: withSpring(`${progress.value * 360}deg`, { damping: 15 }),
      },
    ],
  }));

  return (
    <Pressable onPress={toggleTheme}>
      <Animated.View
        style={[
          {
            width: 48,
            height: 28,
            borderRadius: 14,
            padding: 4,
          },
          switchStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            },
            toggleStyle,
          ]}
        >
          <Animated.View style={iconStyle}>
            {colorScheme === "light" ? (
              <Feather name="sun" size={12} color="#FFF" />
            ) : (
              <Feather name="moon" size={12} color="#FFF" />
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default ProfileThemeSwitcher;
