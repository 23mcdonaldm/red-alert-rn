import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Colors, Brand } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/hooks/useAuth";

// Import our new components
import CustomToast from "@/components/Toast";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { colorScheme } = useColorScheme();
  const { isLoading, handleEmailAuth, onGoogleButtonPress } = useAuth();

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
      {/* Toast Component */}
      <CustomToast />
      
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require("@/assets/images/ra-logo.png")}
          style={{ width: 120, height: 120 }}
          className="mb-12"
        />
        {/* Hero Text */}
        <View className="w-full mb-12 items-center">
          <Text
            className="text-5xl font-bold mb-3 text-center"
            style={{ color: Brand.primary }}
          >
            SCHOOL SAFETY.
          </Text>
          <Text
            className="text-4xl font-bold text-center"
            style={{ color: Brand.secondary }}
          >
            AT YOUR FINGERTIPS.
          </Text>
        </View>

        <View className="w-full max-w-sm space-y-6">
          {/* Email Input */}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <PasswordInput 
            value={password}
            onChangeText={setPassword}
          />

          <View className="space-y-4 mt-6">
            {isSigningUp ? (
              <TouchableOpacity
                className="rounded-full p-4"
                style={{ backgroundColor: Brand.secondary }}
                onPress={() => handleEmailAuth(email, password, isSigningUp)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text className="text-black text-center font-bold text-lg">
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="rounded-full p-4"
                style={{ backgroundColor: Brand.secondary }}
                onPress={() => handleEmailAuth(email, password, isSigningUp)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text className="text-black text-center font-bold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <View className="flex-row items-center my-4">
              <View
                className="flex-1 h-0.5"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? Colors.dark.border
                      : Colors.light.border,
                }}
              />
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary,
                }}
                className="mx-4 text-lg"
              >
                or
              </Text>
              <View
                className="flex-1 h-0.5"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? Colors.dark.border
                      : Colors.light.border,
                }}
              />
            </View>

            <TouchableOpacity
              className="flex-row justify-center items-center rounded-full p-4 space-x-3"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? Colors.dark.card : Colors.light.card,
                borderColor:
                  colorScheme === "dark"
                    ? Colors.dark.border
                    : Colors.light.border,
                borderWidth: 1,
              }}
              onPress={onGoogleButtonPress}
              disabled={isLoading}
            >
              <Image
                source={require("../../assets/images/google-logo.webp")}
                style={{ width: 28, height: 28 }}
              />
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                }}
                className="font-semibold text-lg"
              >
                {isSigningUp ? "Sign Up" : "Sign In"} with Google
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setIsSigningUp(!isSigningUp)}
            className="mt-6"
          >
            <Text
              className="text-center text-lg"
              style={{ color: Brand.primary }}
            >
              {isSigningUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
