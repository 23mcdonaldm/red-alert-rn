import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { GroupChat } from "@/types/forum";
import FirestoreService from "@/services/FirestoreService";
import { useSelector } from "react-redux";
import { InitialStateType } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface GroupListProps {
  onGroupSelect: (groupId: string, groupName: string) => void;
}

export default function GroupList({ onGroupSelect }: GroupListProps) {
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector(
    (state: { auth: InitialStateType }) => state.auth
  );
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userData?.uid) return;

      try {
        // Query all groups
        const result = await FirestoreService.queryGroups();

        // Filter groups where the user is a member
        const userGroups = result.groups.filter((group) =>
          group.members.some((member) => member.userId === userData.uid)
        );

        setGroups(userGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();

    // Set up real-time listener for groups
    const unsubscribe = FirestoreService.onSnapshot("groupChats", () => {
      fetchGroups();
    });

    return () => unsubscribe();
  }, [userData?.uid]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      let date: Date;

      // Handle if it's already a Date object
      if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Handle React Native Firebase Timestamp
      else if (timestamp._seconds !== undefined) {
        date = new Date(timestamp._seconds * 1000);
      }
      // Handle Firestore timestamp object with seconds and nanoseconds
      else if (
        timestamp.seconds !== undefined &&
        timestamp.nanoseconds !== undefined
      ) {
        date = new Date(
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
      }
      // Handle Web Firestore Timestamp or any timestamp with toDate()
      else if (typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      }
      // If none of the above, try to parse as a string or number
      else if (typeof timestamp === "string" || typeof timestamp === "number") {
        date = new Date(timestamp);
        // If the date is invalid, return empty string
        if (isNaN(date.getTime())) {
          console.warn("Invalid date string/number:", timestamp);
          return "";
        }
      }
      // If none of the above, return empty string
      else {
        console.warn("Unknown timestamp format:", timestamp);
        return "";
      }

      return formatDate(date);
    } catch (error) {
      console.warn("Error formatting timestamp:", error);
      return "";
    }
  };

  const formatDate = (date: Date) => {
    try {
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    } catch (error) {
      console.warn("Error in formatDate:", error);
      return "";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    groupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      backgroundColor: theme.card,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    contentContainer: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    groupName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    timestamp: {
      fontSize: 12,
      color: theme.textSecondary,
      marginRight: 4,
    },
    memberCount: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    createdBy: {
      fontSize: 12,
      color: theme.textTertiary,
      marginTop: 2,
    },
    chevron: {
      marginLeft: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      color: theme.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      backgroundColor: theme.background,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading your groups...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.groupItem}
          onPress={() => onGroupSelect(item.id, item.name)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.groupName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.timestamp}>
                  {formatTimestamp(item.createdAt)}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.textSecondary}
                  style={styles.chevron}
                />
              </View>
            </View>
            <Text style={styles.memberCount}>
              {item.members.length}{" "}
              {item.members.length === 1 ? "member" : "members"}
            </Text>
            <Text style={styles.createdBy}>
              Created by: {item.createdBy === userData?.uid ? "You" : "Other"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="chatbubbles-outline" size={28} color={theme.primary} />
          </View>
          <Text style={styles.emptyTitle}>No groups yet</Text>
          <Text style={styles.emptyText}>
            Join or create a group to start chatting with others
          </Text>
        </View>
      )}
    />
  );
}
