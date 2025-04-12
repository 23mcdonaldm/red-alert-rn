import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface ProfileCardProps {
  profilePhoto: string | ImageSourcePropType;
  name: string;
  xp: number;
  mainRole: string;
  secondaryRoles?: string[];
  description: string;
  onChat: () => void;
  onBookmark: () => void;
  onRandomize: () => void;
  
}

const ProfileCard2: React.FC<ProfileCardProps> = ({
  profilePhoto,
  name,
  xp,
  mainRole,
  secondaryRoles = [],
  description,
  onChat,
  onBookmark,
  onRandomize,
  
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Profile Image and Information */}
        <View style={[
            styles.profile,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={[styles.cardHeader, { borderColor: theme.border }]}>
                <Text style={[styles.cardHeaderText, { color: theme.text }]}>
                    {mainRole}
                </Text>
                <TouchableOpacity onPress={onRandomize}>
                    <Ionicons name="shuffle" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
          </View>
          <View style={styles.profileHeader}>
            <Image
              source={profilePhoto as ImageSourcePropType}
              style={[
                styles.profileAvatar,
                { borderColor: theme.borderSecondary },
              ]}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{name}</Text>
              <Text style={[styles.mainRole, { color: theme.textSecondary }]}>{mainRole}</Text>
              <Text style={[styles.mainRole, { color: theme.textTertiary }]}>XP: {xp}</Text>
            </View>
          </View>

          {/* Left-aligned Description */}
          <Text style={[styles.profileDescription, { color: theme.text }]}>
            {description}
          </Text>

          {/* Bookmark & Chat Buttons positioned below the description */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.bookmarkButton,
                { backgroundColor: theme.backgroundSecondary },
              ]}
              onPress={onBookmark}
            >
              <FontAwesome
                name="bookmark"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chatButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={onChat}
            >
              <MaterialCommunityIcons
                name="message"
                size={18}
                color={theme.card}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profile: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderWidth: 1,
    width: "80%",
    maxWidth: 320,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 9999,
    borderWidth: 1,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  mainRole: {
    fontSize: 14,
    marginTop: 4,
  },
  profileDescription: {
    fontSize: 13,
    textAlign: "left",
    marginTop: 12,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  bookmarkButton: {
    padding: 12,
    borderRadius: 50,
    marginRight: 10,
  },
  chatButton: {
    padding: 12,
    borderRadius: 50,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: 12,
    borderBottomWidth: 3,
     // You can use theme.border too
  },
  
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "700", // Stronger bold
  },

});

  

export default ProfileCard2;