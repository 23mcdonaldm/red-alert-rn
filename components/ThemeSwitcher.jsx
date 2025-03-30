import React, { useEffect } from "react";
import { Platform, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const THEME_KEY = "@app_theme";

const ThemeButton = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      if (Platform.OS === "web") {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) setColorScheme(savedTheme);
      } else {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) setColorScheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = colorScheme === "light" ? "dark" : "light";

    // Animate scale and rotation
    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    rotate.value = withTiming(1, { duration: 400 });

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

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          rotate.value,
          [0, 1],
          [0, 360],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPress={toggleTheme}
        className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center 
          bg-gradient-to-br from-white via-gray-50 to-gray-100 
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
          shadow-md 
          dark:border dark:border-gray-700
          active:scale-95 transition-all duration-200 
          hover:shadow-lg
          flex-shrink-0"
        style={{
          elevation: colorScheme === "dark" ? 8 : 2,
          shadowColor: colorScheme === "dark" ? "#000" : "#64748b",
          shadowOffset: {
            width: 0,
            height: colorScheme === "dark" ? 4 : 2,
          },
          shadowOpacity: colorScheme === "dark" ? 0.3 : 0.08,
          shadowRadius: colorScheme === "dark" ? 12 : 8,
        }}
      >
        <Animated.View style={iconStyle}>
          {colorScheme === "light" ? (
            <Feather
              name="moon"
              size={32}
              color={Colors.light.textSecondary}
              className="md:scale-110"
            />
          ) : (
            <Feather
              name="sun"
              size={32}
              color={Colors.dark.textSecondary}
              className="md:scale-110"
            />
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default ThemeButton;
