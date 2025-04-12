import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "nativewind";
import CreateGroupModal from "@/components/Forum/CreateGroupModal";
import GroupList from "@/components/Forum/GroupList";
import SearchGroups from "@/components/Forum/SearchGroups";
import ChatScreen from "@/components/Forum/ChatScreen";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type TabType = "joined" | "search";

export default function Forum() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("joined");
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleGroupCreated = (groupId: string) => {
    setSelectedGroup({ id: groupId, name: "New Group" });
  };

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setSelectedGroup({ id: groupId, name: groupName });
  };

  const handleBack = () => {
    setSelectedGroup(null);
  };

  if (selectedGroup?.id) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        <ChatScreen
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onBack={handleBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View 
        style={{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.background
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>
          Groups
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3
          }}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ 
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        borderBottomColor: theme.border,
        backgroundColor: theme.background
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === "joined" ? 2 : 0,
            borderBottomColor: activeTab === "joined" ? theme.primary : 'transparent'
          }}
          onPress={() => setActiveTab("joined")}
        >
          <Text
            style={{
              fontWeight: '600',
              color: activeTab === "joined" ? theme.primary : theme.textSecondary
            }}
          >
            My Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === "search" ? 2 : 0,
            borderBottomColor: activeTab === "search" ? theme.primary : 'transparent'
          }}
          onPress={() => setActiveTab("search")}
        >
          <Text
            style={{
              fontWeight: '600',
              color: activeTab === "search" ? theme.primary : theme.textSecondary
            }}
          >
            Discover
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {activeTab === "joined" ? (
          <GroupList onGroupSelect={handleGroupSelect} />
        ) : (
          <SearchGroups onGroupSelect={handleGroupSelect} />
        )}
      </View>

      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={handleGroupCreated}
      />
    </SafeAreaView>
  );
}
