import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

interface MessageInputProps {
  onSend: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(44);
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const animatedScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (message.trim()) {
      // Animate button press
      Animated.sequence([
        Animated.timing(animatedScale, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onSend(message.trim());
      setMessage("");
      setInputHeight(44); // Reset input height
      if (Platform.OS !== "web") {
        Keyboard.dismiss();
      }
    }
  };

  const onContentSizeChange = (event: any) => {
    const newHeight = Math.min(
      Math.max(44, event.nativeEvent.contentSize.height),
      120
    );
    setInputHeight(newHeight);
  };

  const handleKeyPress = (e: any) => {
    if (
      Platform.OS === "web" &&
      e.nativeEvent.key === "Enter" &&
      !e.nativeEvent.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              height: inputHeight,
            },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.textTertiary}
          multiline
          maxLength={500}
          onContentSizeChange={onContentSizeChange}
          onKeyPress={handleKeyPress}
        />
        <Animated.View style={[{ transform: [{ scale: animatedScale }] }]}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: message.trim()
                  ? theme.primary
                  : theme.backgroundTertiary,
              },
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim() ? theme.background : theme.textTertiary}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingTop: Platform.OS === "ios" ? 8 : 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
