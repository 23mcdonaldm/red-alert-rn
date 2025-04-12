import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Message } from "@/types/forum";
import FirestoreService from "@/services/FirestoreService";
import FirebaseCoreService from "@/services/FirebaseCoreService";
import { Timestamp } from "firebase/firestore";
import { MessagesList } from "./Chat/MessagesList";
import { MessageInput } from "./Chat/MessageInput";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";

interface ChatScreenProps {
  groupId: string;
  groupName: string;
  groupDescription?: string;
  onBack: () => void;
}

export default function ChatScreen({
  groupId,
  groupName,
  groupDescription = "",
  onBack,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const auth = FirebaseCoreService.getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!groupId) {
      console.error("No groupId provided");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const messagesSnapshot = await FirestoreService.queryDocuments<Message>(
          "messages",
          "groupId",
          "==",
          groupId,
          "timestamp",
          "asc"
        );

        // Ensure messages is always an array
        const validMessages = Array.isArray(messagesSnapshot)
          ? messagesSnapshot
          : [];
        setMessages(validMessages);

        // Fetch user avatars only if we have messages
        if (validMessages.length > 0) {
          const uniqueUserIds = new Set(
            validMessages.map((msg) => msg.senderId)
          );
          const avatarPromises = Array.from(uniqueUserIds).map(
            async (userId) => {
              try {
                const userDoc = await FirestoreService.readDocument(
                  "users",
                  userId
                );
                return { userId, avatar: userDoc?.avatar || "" };
              } catch (error) {
                console.error(
                  `Error fetching avatar for user ${userId}:`,
                  error
                );
                return { userId, avatar: "" };
              }
            }
          );

          const avatarResults = await Promise.all(avatarPromises);
          const avatarMap = avatarResults.reduce((acc, { userId, avatar }) => {
            acc[userId] = avatar;
            return acc;
          }, {} as Record<string, string>);
          setUserAvatars(avatarMap);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time listener for messages
    const unsubscribe = FirestoreService.onSnapshot("messages", (snapshot) => {
      if (snapshot) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            fetchMessages();
          }
        });
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [groupId]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !groupId || !currentUser) return;

    try {
      const message: Omit<Message, "id"> = {
        groupId,
        text: text.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "Anonymous",
        timestamp: Timestamp.now(),
        type: "text",
        status: "sent",
      };

      await FirestoreService.createDocument("messages", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Generate a consistent group avatar
  const groupAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    groupName
  )}&background=FF6B00&color=fff&size=128`;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.loadingIndicator,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading conversation...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* Modern Chat Header */}
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: theme.backgroundTertiary },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>

          <Image
            source={{ uri: groupAvatar }}
            style={[styles.groupAvatar, { borderColor: theme.primary }]}
          />

          <View style={styles.headerTextContainer}>
            <Text
              style={[styles.groupName, { color: theme.text }]}
              numberOfLines={1}
            >
              {groupName}
            </Text>
            {groupDescription && (
              <Text
                style={[
                  styles.groupDescription,
                  { color: theme.textSecondary },
                ]}
                numberOfLines={1}
              >
                {groupDescription}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Messages List */}
      <MessagesList
        messages={messages}
        currentUserId={currentUser?.uid || ""}
        userAvatars={userAvatars}
      />

      {/* Message Input */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <MessageInput onSend={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 8 : Platform.OS === "android" ? 12 : 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
  },
  groupDescription: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "400",
  },
  inputContainer: {
    borderTopWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingIndicator: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
