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
import { useSelector, useDispatch } from "react-redux";
import { setRole } from "@/store/slices/authSlice";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";


export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
      console.log("✅ Sign-out successful");
    } catch (error) {
      console.error("❌ Sign-out error:", error);
      Alert.alert(
        "Sign-out Failed",
        error.message || "Could not sign out. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    
    <SafeAreaView className="flex-1" style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }}>
      
      <View className="flex-1 justify-center items-center p-6">
        {/* App Title */}
        <View className="w-full items-center mb-8">
          <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-4xl font-bold">
            Welcome Back
          </Text>
        </View>

        {/* User Info Card */}
        <View
          className="items-center p-6 w-full max-w-sm border rounded-2xl shadow-lg mb-8"
          style={{
            backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card,
            borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
          }}
        >
          <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg mb-6">
            {user.displayName || user.email}
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className={`mt-4 p-4 w-full rounded-xl ${
              isLoading ? "opacity-70" : ""
            }`}
            style={{ backgroundColor: isLoading ? '#f87171' : '#ef4444' }}
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
            backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card,
            borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
          }}
        >
          {user.photoURL && (
            <Image
              source={{ uri: user.photoURL }}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
            />
          )}
          <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-2xl font-bold">
            {user.displayName}
          </Text>
          <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg">
            {user.email}
          </Text>
          <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg">
            Role: {user.role}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
