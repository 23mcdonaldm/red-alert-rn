import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { Colors, Brand } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

type RoleSelectionModalProps = {
  visible: boolean;
  onSelectRole: (role: string) => void;
};

export default function RoleSelectionModal({
  visible,
  onSelectRole,
}: RoleSelectionModalProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-lg shadow-lg w-3/4 items-center">
          {/* Progress Indicator */}
          <View className="flex-row mb-6">
            <View
              className="w-20 h-2 rounded-full"
              style={{ backgroundColor: Brand.primary, marginRight: 12 }}
            />
            <View
              className="w-20 h-2 rounded-full"
              style={{
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.backgroundTertiary
                    : Colors.light.backgroundTertiary,
              }}
            />
          </View>

          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
            }}
            className="text-lg mb-6"
          >
            Almost Done
          </Text>

          {/* OMAL Logo */}
          <Image
            source={require("../../assets/images/omal-logo-o.png")}
            style={{ width: 120, height: 120, marginBottom: 24 }}
          />

          <Text
            style={{
              color:
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            }}
            className="text-2xl font-bold mb-6"
          >
            Select Your Role
          </Text>

          {/* Role Selection Buttons */}
          {["Freelancer", "Educator", "Client"].map((role) => (
            <TouchableOpacity
              key={role}
              className="flex-row justify-center items-center p-5 mb-4 rounded-xl w-full"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? Colors.dark.card : Colors.light.card,
              }}
              onPress={() => onSelectRole(role)}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                }}
                className="text-xl font-semibold"
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
