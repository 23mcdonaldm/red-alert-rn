import React from "react";
import { Pressable, View, Text } from "react-native";

type DropdownMenuProps = {
  showMenu: boolean;
  toggleMenu: () => void;
};

const DropdownMenu = ({ showMenu, toggleMenu }: DropdownMenuProps) => {
  if (!showMenu) return null; // Don't render the dropdown if showMenu is false

  return (
    <View className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border border-gray-200">
      <Pressable onPress={() => console.log("Go to Profile")}>
        <Text className="px-4 py-3 text-black text-sm hover:bg-gray-100">
          Profile
        </Text>
      </Pressable>
      <Pressable onPress={() => console.log("Go to Settings")}>
        <Text className="px-4 py-3 text-black text-sm hover:bg-gray-100">
          Settings
        </Text>
      </Pressable>
      <Pressable onPress={() => console.log("Log Out")}>
        <Text className="px-4 py-3 text-black text-sm hover:bg-gray-100">
          Log Out
        </Text>
      </Pressable>
    </View>
  );
};

export default DropdownMenu;
