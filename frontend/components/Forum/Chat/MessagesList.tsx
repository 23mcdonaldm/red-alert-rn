import React, { useRef, useEffect } from "react";
import { FlatList, View, StyleSheet, Text, Animated } from "react-native";
import { useColorScheme } from "nativewind";
import { Message } from "@/types/forum";
import { Message as MessageComponent } from "./Message";
import { Colors } from "@/constants/Colors";

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  userAvatars: Record<string, string>;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  currentUserId,
  userAvatars,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sort messages by timestamp, handling both web and native Firebase timestamp types
  const sortedMessages = [...messages].sort((a, b) => {
    const getTimestamp = (message: Message) => {
      const timestamp = message.timestamp;
      if (!timestamp) return 0;

      // Handle web Firebase timestamp
      if (typeof timestamp.toMillis === "function") {
        return timestamp.toMillis();
      }

      // Handle native Firebase timestamp
      if (timestamp.seconds !== undefined) {
        return timestamp.seconds * 1000;
      }

      // Fallback for any other timestamp format
      if (timestamp instanceof Date) {
        return timestamp.getTime();
      }

      return 0;
    };

    return getTimestamp(b) - getTimestamp(a);
  });

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageComponent
      message={item}
      isCurrentUser={item.senderId === currentUserId}
      userAvatar={userAvatars[item.senderId]}
    />
  );

  const keyExtractor = (item: Message) => item.id || Math.random().toString();

  if (messages.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.emptyContent,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No messages yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Start the conversation by sending a message below
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity: fadeAnim,
        },
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        style={styles.flatList}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.background },
        ]}
        inverted={true}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContent: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
