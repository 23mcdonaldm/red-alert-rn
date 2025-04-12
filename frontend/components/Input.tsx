import React from "react";
import {
  View,
  TextInput,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rest?: any;
};

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style = {},
  inputStyle = {},
  ...rest
}: InputProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={`bg-opacity-20 rounded-lg overflow-hidden border ${
        colorScheme === "dark" ? "bg-dark-input border-dark-inputBorder" : "bg-light-input border-light-inputBorder"
      }`}
    >
      <TextInput
        placeholder={placeholder}
        className={`p-4 text-lg w-full ${
          colorScheme === "dark" ? "text-dark-text" : "text-light-text"
        }`}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={
          colorScheme === "dark"
            ? Colors.dark.placeholder
            : Colors.light.placeholder
        }
        {...rest}
      />
    </View>
  );
};

export default Input;
