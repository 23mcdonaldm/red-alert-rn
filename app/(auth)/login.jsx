import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "react-native-toast-message";
import { Colors, Brand } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  const showToast = (type, message) => {
    if (Platform.OS === "web") {
      toast[type](message);
    } else {
      Toast.show({
        type,
        text1: message,
      });
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      showToast("error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      if (Platform.OS === "web") {
        if (isSigningUp) {
          await createUserWithEmailAndPassword(getAuth(), email, password);
        } else {
          await signInWithEmailAndPassword(getAuth(), email, password);
        }
      } else {
        if (isSigningUp) {
          await auth().createUserWithEmailAndPassword(email, password);
        } else {
          await auth().signInWithEmailAndPassword(email, password);
        }
      }
    } catch (error) {
      console.error("❌ Email/Password Auth Error:", error);

      let errorMessage = "Failed to authenticate. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already registered";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      }

      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === "web") {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
      } else {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        const signInResult = await GoogleSignin.signIn();
        let idToken = signInResult.data?.idToken || signInResult.idToken;

        if (!idToken)
          throw new Error("No ID token received from Google Sign-In");

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
        console.log("✅ Mobile Google sign-in successful");
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);

      if (Platform.OS !== "web") {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // User cancelled the sign-in flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          showToast("info", "Sign-in is already in progress");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          showToast(
            "error",
            "Google Play Services is not available on this device"
          );
        } else {
          showToast("error", error.message || "Failed to sign in with Google");
        }
      } else {
        showToast("error", error.message || "Failed to sign in with Google");
      }
    } finally {
      setIsLoading(false);
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
      {Platform.OS === "web" && (
        <ToastContainer theme={colorScheme === "dark" ? "dark" : "light"} />
      )}
      {Platform.OS !== "web" && (
        <SafeAreaView
          style={{ position: "absolute", width: "100%", zIndex: 1000 }}
        >
          <Toast
            config={{
              error: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#FF4444",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        !
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
              success: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#4CAF50",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
              info: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#2196F3",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        i
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
            }}
            position="top"
            visibilityTime={3000}
            topOffset={Platform.OS === "ios" ? 50 : 30}
          />
        </SafeAreaView>
      )}
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require("../../assets/images/ra-logo.png")}
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
          <View
            className="bg-opacity-20 rounded-lg overflow-hidden"
            style={{
              backgroundColor:
                colorScheme === "dark" ? Colors.dark.input : Colors.light.input,
              borderWidth: 1,
              borderColor:
                colorScheme === "dark"
                  ? Colors.dark.inputBorder
                  : Colors.light.inputBorder,
            }}
          >
            <TextInput
              placeholder="Email"
              className="p-4 text-lg w-full"
              style={{
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                backgroundColor: "transparent",
              }}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={
                colorScheme === "dark"
                  ? Colors.dark.placeholder
                  : Colors.light.placeholder
              }
            />
          </View>

          <View
            className="bg-opacity-20 rounded-lg overflow-hidden relative"
            style={{
              backgroundColor:
                colorScheme === "dark" ? Colors.dark.input : Colors.light.input,
              borderWidth: 1,
              borderColor:
                colorScheme === "dark"
                  ? Colors.dark.inputBorder
                  : Colors.light.inputBorder,
            }}
          >
            <TextInput
              placeholder="Password"
              className="p-4 text-lg w-full pr-12"
              style={{
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                backgroundColor: "transparent",
              }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={
                colorScheme === "dark"
                  ? Colors.dark.placeholder
                  : Colors.light.placeholder
              }
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 12,
                top: 0,
                bottom: 0,
                justifyContent: "center",
              }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={
                  colorScheme === "dark"
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          <View className="space-y-4 mt-6">
            {isSigningUp ? (
              <TouchableOpacity
                className="rounded-full p-4"
                style={{ backgroundColor: Brand.secondary }}
                onPress={handleEmailAuth}
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
                onPress={handleEmailAuth}
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
