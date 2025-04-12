import React from "react";
import { View } from "react-native";
import ProfileCard from "@/components/ProfileCard";
import ProfileThemeSwitcher from "@/components/ProfileThemeSwitcher";
import { Colors } from "@/constants/Colors";
const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");

export default function ClientProfile() {
  return (
    <View
      className={`flex-1 light:${Colors.light.background} dark:${Colors.dark.background}`}
    >
      <View className="absolute top-6 right-6 z-10">
        <ProfileThemeSwitcher />
      </View>
      
      <ProfileCard />
    </View>
  );
}