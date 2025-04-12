import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/types/common";

export default function HomeHeader() {
  const { userData: user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <View className="flex-row justify-between items-center p-4">
      <Image
        source={require("@/assets/images/omal-logo.png")}
        className="w-16 h-8"
      />
      <TouchableOpacity>
        <Image source={{ uri: user.avatar }} className="w-8 h-8 rounded-full" />
      </TouchableOpacity>
    </View>
  );
}
