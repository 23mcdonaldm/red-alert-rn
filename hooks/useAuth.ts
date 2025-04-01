import { useState } from "react";
import { Platform } from "react-native";
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
import { useToast } from "./useToast";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleEmailAuth = async (
    email: string,
    password: string,
    isSigningUp: boolean
  ) => {
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
    } catch (error: unknown) {
      console.error("❌ Email/Password Auth Error:", error);

      let errorMessage = "Failed to authenticate. Please try again.";

      if (isFirebaseAuthError(error)) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email address is already registered";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address";
            break;
          case "auth/wrong-password":
          case "auth/user-not-found":
            errorMessage = "Invalid email or password";
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters";
            break;
        }
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

        await GoogleSignin.signIn();
        const { idToken } = await GoogleSignin.getTokens();

        if (!idToken) {
          throw new Error("No ID token received from Google Sign-In");
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);

        console.log("✅ Mobile Google sign-in successful");
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);

      if (isFirebaseAuthError(error)) {
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
            showToast(
              "error",
              error.message || "Failed to sign in with Google"
            );
          }
        } else {
          showToast("error", error.message || "Failed to sign in with Google");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEmailAuth,
    onGoogleButtonPress,
    isLoading,
  };
}

function isFirebaseAuthError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as any).code === "string" &&
    typeof (error as any).message === "string"
  );
}
