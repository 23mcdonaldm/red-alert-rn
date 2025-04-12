import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useToast } from "@/hooks/useToast";
import FirestoreService from "@/services/FirestoreService";
import FirebaseCoreService from "@/services/FirebaseCoreService";
import { GroupChat } from "@/types/forum";
import { Timestamp } from "firebase/firestore";
import { Platform as RNPlatform } from "react-native";
import { firebase } from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onGroupCreated: (groupId: string) => void;
}

export default function CreateGroupModal({
  visible,
  onClose,
  onGroupCreated,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = Dimensions.get('window');

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.showToast("error", "Please enter a group name");
      return;
    }

    const auth = FirebaseCoreService.getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.showToast("error", "You must be logged in to create a group");
      return;
    }

    setLoading(true);
    try {
      const newGroup: Omit<GroupChat, "id"> = {
        name: groupName.trim(),
        createdAt:
          RNPlatform.OS === "web"
            ? Timestamp.now()
            : firebase.firestore.Timestamp.now(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || "Anonymous",
        members: [
          {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Anonymous",
            joinedAt:
              RNPlatform.OS === "web"
                ? Timestamp.now()
                : firebase.firestore.Timestamp.now(),
            role: "admin",
          },
        ],
        isPublic: true,
        memberCount: 1,
      };

      const groupId = await FirestoreService.createDocument(
        "groupChats",
        newGroup
      );
      onGroupCreated(groupId);
      setGroupName("");
      onClose();
    } catch (error) {
      toast.showToast("error", "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 20,
      width: Math.min(width - 40, 400),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      color: theme.text,
      fontSize: 16,
      marginBottom: 20,
    },
    createButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Create New Group</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Ionicons name="close" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter group name"
                placeholderTextColor={theme.placeholder}
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="words"
                autoFocus
              />

              <TouchableOpacity
                style={[
                  styles.createButton,
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleCreateGroup}
                disabled={loading}
              >
                <Text style={styles.createButtonText}>
                  {loading ? "Creating..." : "Create Group"}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
