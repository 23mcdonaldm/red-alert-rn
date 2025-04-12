import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ChatHeaderProps {
  groupName: string;
  onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  groupName,
  onBack,
}) => {
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: Colors.light.background,
          borderBottomColor: Colors.light.border,
          shadowColor: Colors.light.text,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={[
          styles.backButton,
          { backgroundColor: Colors.light.backgroundSecondary },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: Colors.light.text }]}>
        {groupName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
});
