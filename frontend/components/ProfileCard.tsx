import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "nativewind";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/types/common";
import { Colors } from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");

export default function ProfileCard() {
  const { userData } = useSelector((state: RootState) => state.auth);
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const scale = useSharedValue(1);

  const isDark = colorScheme === "dark";

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLogout = () => {
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
      dispatch(logout());
    }, 100);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark
          ? Colors.dark.background
          : Colors.light.background,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "100%", maxWidth: 420, alignItems: "center" }}>
        {/* Profile Card */}
        <Animated.View
          style={[
            cardStyle,
            {
              width: "100%",
              backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 24,
            },
          ]}
        >
          {/* Banner Area */}
          <View style={{ height: 80, backgroundColor: Colors.light.primary }} />

          {/* Profile Content */}
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 16,
              paddingBottom: 32,
              paddingTop: 48,
              position: "relative",
            }}
          >
            {/* Avatar */}
            <View
              style={{
                position: "absolute",
                top: -40,
                borderRadius: 50,
                borderWidth: 4,
                borderColor: isDark ? Colors.dark.card : Colors.light.card,
              }}
            >
              <Image
                source={
                  userData?.avatar ? { uri: userData.avatar } : DefaultAvatar
                }
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </View>

            {/* User Info */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 12,
                color: isDark ? Colors.dark.text : Colors.light.text,
              }}
            >
              {userData?.fullname || "User"}
            </Text>

            <Text
              style={{
                fontSize: 16,
                marginTop: 4,
                marginBottom: 12,
                color: isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
              }}
            >
              {userData?.email}
            </Text>

            <View
              style={{
                backgroundColor: isDark
                  ? `${Colors.light.primary}30`
                  : `${Colors.light.primary}20`,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 100,
              }}
            >
              <Text
                style={{
                  color: Colors.light.primary,
                  fontWeight: "500",
                }}
              >
                {userData?.role || "Member"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={{ width: "100%", gap: 12 }}>
          {/* Sign Out Button */}
          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: Colors.light.primary,
              borderRadius: 12,
              paddingVertical: 16,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather
              name="log-out"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Sign Out
            </Text>
          </Pressable>

          {/* Edit Profile Button */}
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: isDark ? Colors.dark.border : Colors.light.border,
              borderRadius: 12,
              paddingVertical: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
                color: isDark ? Colors.dark.text : Colors.light.text,
              }}
            >
              Edit Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
