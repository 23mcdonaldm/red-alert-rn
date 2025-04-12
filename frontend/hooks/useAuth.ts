import { useState } from "react";
import { useToast } from "./useToast";
import {
  FirebaseAuthError,
  AuthHookReturn,
  AUTH_ERROR_MESSAGES,
} from "@/types/auth";
import AuthService from "@/services/AuthService";

/**
 * Checks if an error is a Firebase authentication error
 */
function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as any).code === "string" &&
    typeof (error as any).message === "string"
  );
}

/**
 * Get a user-friendly error message from a Firebase error
 */
function getErrorMessage(error: unknown): string {
  if (isFirebaseAuthError(error)) {
    return (
      AUTH_ERROR_MESSAGES[error.code] ||
      error.message ||
      "Authentication failed"
    );
  }
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred";
}

/**
 * Custom hook for Firebase authentication
 * Provides methods for email/password auth, Google auth, password reset, and logout
 */
export function useAuth(): AuthHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  /**
   * Handle email/password authentication (both signup and login)
   * @param email User email
   * @param password User password
   * @param isSigningUp Whether the user is signing up or logging in
   * @returns Promise resolving to true if successful, false otherwise
   */
  const handleEmailAuth = async (
    email: string,
    password: string,
    isSigningUp: boolean
  ): Promise<boolean> => {
    if (!email || !password) {
      showToast("error", "Please enter both email and password");
      return false;
    }

    setIsLoading(true);
    try {
      await AuthService.handleEmailAuth(email, password, isSigningUp);
      return true;
    } catch (error: unknown) {
      showToast("error", getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google authentication
   * @returns Promise resolving to true if successful, false otherwise
   */
  const onGoogleButtonPress = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await AuthService.handleGoogleAuth();
      return true;
    } catch (error) {
      showToast("error", getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out the current user
   * @returns Promise resolving to true if successful, false otherwise
   */
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      showToast("error", getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send password reset email
   * @param email User email
   * @returns Promise resolving to true if successful, false otherwise
   */
  const resetPassword = async (email: string): Promise<boolean> => {
    if (!email) {
      showToast("error", "Please enter your email address");
      return false;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(email);
      showToast("success", "Password reset email sent. Check your inbox.");
      return true;
    } catch (error) {
      showToast("error", getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEmailAuth,
    onGoogleButtonPress,
    resetPassword,
    logout,
    isLoading,
  };
}
