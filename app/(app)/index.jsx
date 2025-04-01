import React, { useState, useEffect } from "react";
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
import { Colors, Brand } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

import MyButton from "@/components/MyButton";

export default function GoogleSignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showRelevanceTest, setShowRelevanceTest] = useState(false);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (user && !user.role) {
      setShowRelevanceTest(true);
    }
  }, [user]);

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

  const handleRoleSelection = (role) => {
    dispatch(setRole(role));
    setShowRelevanceTest(false);
  };

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }}>
      <View className="flex-1 justify-center items-center p-6">
        {showRelevanceTest ? (
          <View className="w-full max-w-sm items-center">
            {/* Progress Indicator */}
            <View className="flex-row mb-6">
              <View className="w-20 h-2 rounded-full" style={{ backgroundColor: Brand.primary, marginRight: 12 }} />
              <View className="w-20 h-2 rounded-full" style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.backgroundTertiary : Colors.light.backgroundTertiary }} />
            </View>
            <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg mb-6">
              Almost Done
            </Text>
            {/* OMAL Logo */}
            <Image
              source={require("../../assets/images/ra-logo.png")}
              style={{ width: 120, height: 120, marginBottom: 24 }}
            />
            <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-2xl font-bold mb-6">
              Select Your Role
            </Text>
            <TouchableOpacity
              className="flex-row justify-center items-center p-5 mb-4 rounded-xl w-full"
              style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card }}
              onPress={() => handleRoleSelection("Student")}
            >
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-xl font-semibold">
                Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-center items-center p-5 mb-4 rounded-xl w-full"
              style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card }}
              onPress={() => handleRoleSelection("Administrator")}
            >
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-xl font-semibold">
                Administrator
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-center items-center p-5 mb-4 rounded-xl w-full"
              style={{ backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card }}
              onPress={() => handleRoleSelection("Guardian")}
            >
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-xl font-semibold">
                Guardian
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* App Title */}
            <View className="w-full mb-12 items-center">
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-4xl font-bold mb-3">
                Welcome Back
              </Text>
            </View>

            <View 
              className="items-center p-8 w-full max-w-sm border rounded-2xl shadow-lg mb-8"
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
            <MyButton title="Map" href="/map" />

            {/* User Information Card */}
            <View 
              className="p-8 w-full max-w-sm border rounded-2xl shadow-lg"
              style={{ 
                backgroundColor: colorScheme === 'dark' ? Colors.dark.card : Colors.light.card,
                borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
              }}
            >
              <Image
                source={{ uri: user.photoURL }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 24,
                }}
              />
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }} className="text-2xl font-bold mb-3">
                Display Name: {user.displayName}
              </Text>
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg mb-3">
                Email: {user.email}
              </Text>
              <Text style={{ color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }} className="text-lg">
                Role: {user.role}
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
