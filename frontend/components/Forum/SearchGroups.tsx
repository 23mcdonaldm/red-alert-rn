import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { GroupChat, Message, GroupChatMember } from "@/types/forum";
import FirestoreService from "@/services/FirestoreService";
import FirebaseCoreService from "@/services/FirebaseCoreService";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import {
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface SearchGroupsProps {
  onGroupSelect: (groupId: string, groupName: string) => void;
}

export default function SearchGroups({ onGroupSelect }: SearchGroupsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState<
    | QueryDocumentSnapshot<DocumentData>
    | FirebaseFirestoreTypes.QueryDocumentSnapshot
    | undefined
  >();
  const [hasMore, setHasMore] = useState(true);
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const fetchGroups = async (isLoadingMore = false) => {
    const auth = FirebaseCoreService.getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      if (!isLoadingMore) {
        setLoading(true);
      }
      setError(null);

      const result = await FirestoreService.queryGroups(
        isLoadingMore ? lastVisible : undefined
      );

      if (result.groups.length === 0) {
        setHasMore(false);
      }

      // Fetch last message for each group
      const groupsWithLastMessage = await Promise.all(
        result.groups.map(async (group) => {
          try {
            const messages = await FirestoreService.queryDocuments<Message>(
              "messages",
              "groupId",
              "==",
              group.id,
              "timestamp",
              "desc",
              1
            );
            return {
              ...group,
              lastMessage: messages[0] || undefined,
            };
          } catch (error) {
            console.error(
              `Error fetching last message for group ${group.id}:`,
              error
            );
            return {
              ...group,
              lastMessage: undefined,
            };
          }
        })
      );

      setGroups((prev) =>
        isLoadingMore
          ? [...prev, ...groupsWithLastMessage]
          : groupsWithLastMessage
      );
      setLastVisible(result.lastVisible);

      // Update joined groups by checking if current user is a member
      const userGroups = groupsWithLastMessage.filter((group) =>
        group.members.some((member) => member.userId === currentUser.uid)
      );
      setJoinedGroups((prev) =>
        isLoadingMore
          ? [...prev, ...userGroups.map((group) => group.id)]
          : userGroups.map((group) => group.id)
      );
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();

    // Set up real-time listener for groups
    const unsubscribe = FirestoreService.onSnapshot("groupChats", () => {
      // Refresh the list when changes occur
      fetchGroups();
    });

    return () => unsubscribe();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchGroups(true);
  };

  // Memoize filtered groups to prevent unnecessary recalculations
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groups.filter(group => !joinedGroups.includes(group.id));
    }

    const query = searchQuery.toLowerCase().trim();
    return groups.filter((group) => {
      if (joinedGroups.includes(group.id)) return false;
      const nameMatch = group.name.toLowerCase().includes(query);
      const descriptionMatch = group.description?.toLowerCase().includes(query);
      return nameMatch || descriptionMatch;
    });
  }, [groups, searchQuery, joinedGroups]);

  const handleJoinGroup = async (groupId: string, groupName: string) => {
    const auth = FirebaseCoreService.getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("User not authenticated");
      return;
    }

    try {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;

      // Check if user is already a member
      const isMember = group.members.some(
        (member) => member.userId === currentUser.uid
      );
      if (!isMember) {
        const newMember: GroupChatMember = {
          userId: currentUser.uid,
          userName: currentUser.displayName || "Anonymous",
          joinedAt: Timestamp.now(),
          role: "member",
        };

        await FirestoreService.updateDocument("groupChats", groupId, {
          members: [...group.members, newMember],
          memberCount: group.memberCount + 1,
        });
        setJoinedGroups([...joinedGroups, groupId]);
      }

      onGroupSelect(groupId, groupName);
    } catch (error) {
      console.error("Error joining group:", error);
      setError("Failed to join group. Please try again.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setLastVisible(undefined);
    fetchGroups();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchContainer: {
      padding: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      color: theme.text,
      fontSize: 16,
    },
    clearButton: {
      padding: 4,
    },
    groupItem: {
      flexDirection: 'row',
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
      alignItems: 'flex-start',
    },
    groupInfoContainer: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    memberCount: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    buttonContainer: {
      marginLeft: 12,
    },
    openButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
    },
    joinButton: {
      borderWidth: 1,
      borderColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    joinButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
    },
    lastMessageContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    lastMessageText: {
      fontSize: 14,
      color: theme.textSecondary,
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 16,
    },
    errorText: {
      color: '#EF4444',
      textAlign: 'center',
      marginTop: 8,
    },
    tryAgainButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 16,
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
    loadingMoreContainer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Discovering groups...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.primary} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => {
            setError(null);
            fetchGroups();
          }}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <View style={styles.groupInfoContainer}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.memberCount}>
                    {item.memberCount} {item.memberCount === 1 ? "member" : "members"}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  {joinedGroups.includes(item.id) ? (
                    <TouchableOpacity
                      style={styles.openButton}
                      onPress={() => onGroupSelect(item.id, item.name)}
                    >
                      <Text style={styles.buttonText}>Open</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinGroup(item.id, item.name)}
                    >
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              {item.lastMessage && (
                <View style={styles.lastMessageContainer}>
                  <Text style={styles.lastMessageText} numberOfLines={1}>
                    <Text style={{ fontWeight: '600' }}>Latest: </Text>
                    {item.lastMessage.text}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search" size={28} color={theme.primary} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim() ? "No matching groups found" : "No groups available"}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? "Try a different search term or create a new group"
                : "Create a new group to get started!"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
