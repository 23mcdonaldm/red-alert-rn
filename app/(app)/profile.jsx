import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors, Brand } from "@/constants/Colors";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getAuth, signOut as webSignOut } from "firebase/auth";
import { Platform } from "react-native";

export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      if (Platform.OS === "web") {
        await webSignOut(getAuth());
      } else {
        await GoogleSignin.signOut();
        await auth().signOut();
      }
      dispatch(logout());
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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
      <View className="flex-1 p-6">
        <Text
          className="text-2xl font-bold mb-6"
          style={{
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        >
          Profile
        </Text>
        
        <TouchableOpacity
          className="rounded-full p-4 mt-4"
          style={{ backgroundColor: Brand.secondary }}
          onPress={handleSignOut}
        >
          <Text className="text-black text-center font-bold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 