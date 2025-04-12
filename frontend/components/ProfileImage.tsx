import React from "react";
import { View, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/types/common";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");

type ProfileImageProps = {
  size?: number;
  className?: string;
};

export default function ProfileImage({ size = 32, className = "" }: ProfileImageProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userData } = useSelector((state: RootState) => state.auth);

  return (
    <View
      className={`w-${size} h-${size} rounded-full items-center justify-center ${className}`}
      style={{
        backgroundColor: Colors[isDark ? "dark" : "light"].backgroundSecondary,
      }}
    >
      <Image
        source={userData?.avatar ? { uri: userData.avatar } : DefaultAvatar}
        style={{
          width: size + 2,
          height: size + 2,
          borderRadius: (size + 2) / 2,
        }}
      />
    </View>
  );
} 