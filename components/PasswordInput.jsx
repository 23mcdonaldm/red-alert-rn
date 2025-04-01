import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import Input from "./Input";

const PasswordInput = ({
  placeholder = "Password",
  value,
  onChangeText,
  style = {},
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className="relative" style={style}>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        inputStyle={{ paddingRight: 50 }}
        {...rest}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 12,
          top: 0,
          bottom: 0,
          justifyContent: "center",
        }}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color={
            colorScheme === "dark"
              ? Colors.dark.textSecondary
              : Colors.light.textSecondary
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;