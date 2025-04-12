import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getAuth, signOut as webSignOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { RootState } from "@/types/common";
import { useToast } from "@/hooks/useToast";
const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData: user } = useSelector((state: RootState) => state.auth);
  const { colorScheme } = useColorScheme();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === "web") {
        await webSignOut(getAuth());
      } else {
        await GoogleSignin.signOut();
        await auth().signOut();
      }
    } catch (error: any) {
      useToast().showToast(
        "error",
        error?.message || "Could not sign out. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor:
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background,
      }}
    >
      <View className="flex-1 justify-center items-center p-6">
        {/* App Title */}
        <View className="w-full items-center mb-8">
          <Text
            style={{
              color:
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            }}
            className="text-4xl font-bold"
          >
            Welcome Back
          </Text>
        </View>

        {/* User Info Card */}
        <View
          className="items-center p-6 w-full max-w-sm border rounded-2xl shadow-lg mb-8"
          style={{
            backgroundColor:
              colorScheme === "dark" ? Colors.dark.card : Colors.light.card,
            borderColor:
              colorScheme === "dark" ? Colors.dark.border : Colors.light.border,
          }}
        >
          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
            }}
            className="text-lg mb-6"
          >
            {user.fullname || user.email}
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className={`mt-4 p-4 w-full rounded-xl ${
              isLoading ? "opacity-70" : ""
            }`}
            style={{ backgroundColor: isLoading ? "#f87171" : "#ef4444" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Sign Out
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* User Profile */}
        <View
          className="p-6 w-full max-w-sm border rounded-2xl shadow-lg items-center"
          style={{
            backgroundColor:
              colorScheme === "dark" ? Colors.dark.card : Colors.light.card,
            borderColor:
              colorScheme === "dark" ? Colors.dark.border : Colors.light.border,
          }}
        >
          <Image
            source={user?.avatar ? { uri: user.avatar } : DefaultAvatar}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              color:
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            }}
            className="text-2xl font-bold"
          >
            {user.fullname}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
            }}
            className="text-lg"
          >
            {user.email}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
            }}
            className="text-lg"
          >
            Role: {user.role}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
