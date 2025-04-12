import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { Message as MessageType } from "@/types/forum";
import { formatTimestamp } from "@/utils/dateUtils";
import { Colors } from "@/constants/Colors";

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
  userAvatar?: string;
}

export const Message: React.FC<MessageProps> = ({
  message,
  isCurrentUser,
  userAvatar,
}) => {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    message.senderName
  )}&background=random&color=fff&size=128`;

  if (!message || !message.text) {
    return null;
  }

  // Always ensure we have an avatar
  const avatarSource = userAvatar || defaultAvatar;

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarSource }}
            style={[styles.avatar, { borderColor: theme.backgroundTertiary }]}
          />
        </View>
      )}

      <View
        style={[
          styles.messageContent,
          isCurrentUser ? styles.currentUserContent : styles.otherUserContent,
        ]}
      >
        {!isCurrentUser && (
          <Text style={[styles.senderName, { color: theme.textSecondary }]}>
            {message.senderName}
          </Text>
        )}

        <Pressable>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser
                ? [styles.currentUserBubble, { backgroundColor: theme.primary }]
                : [
                    styles.otherUserBubble,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ],
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: isCurrentUser ? theme.background : theme.text,
                },
              ]}
            >
              {message.text}
            </Text>
          </View>
        </Pressable>

        <Text style={[styles.timestamp, { color: theme.textTertiary }]}>
          {formatTimestamp(message.timestamp)}
        </Text>
      </View>

      {isCurrentUser && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarSource }}
            style={[styles.avatar, { borderColor: theme.primary }]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    marginHorizontal: 2,
  },
  currentUserContainer: {
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageContent: {
    maxWidth: "70%",
  },
  currentUserContent: {
    alignItems: "flex-end",
  },
  otherUserContent: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 8,
    fontWeight: "400",
  },
});
