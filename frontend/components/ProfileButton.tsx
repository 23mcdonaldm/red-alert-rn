import React, { useState } from "react";
import { Image, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";
const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");

import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { RootState } from "@/types/common";

const ProfileButton = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const { colorScheme } = useColorScheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = async () => {
    // Animate scale and rotation
    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    rotate.value = withTiming(1, { duration: 400 });

    setShowMenu(!showMenu);
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
        onPress={() => console.log("Profile clicked")}
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
          <Image
            source={userData?.avatar ? { uri: userData.avatar } : DefaultAvatar}
            style={{ width: 36, height: 36, borderRadius: 50 }}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default ProfileButton;
