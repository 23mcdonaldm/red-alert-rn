import React from "react";
import { View, TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

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
}) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className="bg-opacity-20 rounded-lg overflow-hidden"
      style={{
        backgroundColor:
          colorScheme === "dark" ? Colors.dark.input : Colors.light.input,
        borderWidth: 1,
        borderColor:
          colorScheme === "dark"
            ? Colors.dark.inputBorder
            : Colors.light.inputBorder,
        ...style,
      }}
    >
      <TextInput
        placeholder={placeholder}
        className="p-4 text-lg w-full"
        style={{
          color:
            colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          backgroundColor: "transparent",
          ...inputStyle,
        }}
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