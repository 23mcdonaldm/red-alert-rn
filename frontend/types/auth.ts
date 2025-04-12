export interface UserData {
  email: string;
  fullname: string;
  avatar: string;
  role: string | null;
}

export type FirebaseAuthError = {
  code: string;
  message: string;
};

export type UserDataType = UserData & {
  uid: string;
};

export type InitialStateType = {
  userData: UserDataType | null;
  isAuthenticated: boolean;
};

export interface AuthHookReturn {
  handleEmailAuth: (
    email: string,
    password: string,
    isSigningUp: boolean
  ) => Promise<boolean>;
  onGoogleButtonPress: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "This email address is already registered",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-not-found": "Invalid email or password",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/user-disabled": "This account has been disabled",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/too-many-requests": "Too many requests. Try again later",
  "auth/network-request-failed": "Network error. Check your connection",
  "auth/requires-recent-login": "Please sign in again to continue",
  "auth/invalid-credential": "The credential is malformed or expired",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email address but different credentials",
};
