import FirebaseCoreService from "./FirebaseCoreService";
import FirestoreService from "./FirestoreService";
import { Platform } from "react-native";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as webSignOut,
  sendPasswordResetEmail,
  User as WebUser,
} from "firebase/auth";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { UserData } from "@/types/auth";

const PLATFORM = Platform.OS;

type FirebaseUserType = UserData & {
  uid: string;
};

class AuthService {
  private static auth = FirebaseCoreService.getAuth();

  /**
   * Handle email/password authentication (both signup and login)
   * @param email User email
   * @param password User password
   * @param isSigningUp Whether the user is signing up or logging in
   * @returns Promise resolving to true if successful
   */
  public static async handleEmailAuth(
    email: string,
    password: string,
    isSigningUp: boolean
  ): Promise<boolean> {
    try {
      if (PLATFORM === "web") {
        if (isSigningUp) {
          await createUserWithEmailAndPassword(
            this.auth as any,
            email,
            password
          );
        } else {
          await signInWithEmailAndPassword(this.auth as any, email, password);
        }
      } else {
        if (isSigningUp) {
          await (
            this.auth as FirebaseAuthTypes.Module
          ).createUserWithEmailAndPassword(email, password);
        } else {
          await (
            this.auth as FirebaseAuthTypes.Module
          ).signInWithEmailAndPassword(email, password);
        }
      }
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Handle Google authentication
   * @returns Promise resolving to true if successful
   */
  public static async handleGoogleAuth(): Promise<boolean> {
    try {
      if (PLATFORM === "web") {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(this.auth as any, provider);
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
        await (this.auth as FirebaseAuthTypes.Module).signInWithCredential(
          googleCredential
        );
      }
      return true;
    } catch (error: any) {
      if (error && PLATFORM !== "web") {
        if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
          return false;
        } else if (error.code === statusCodes?.IN_PROGRESS) {
          throw new Error("Sign-in is already in progress");
        } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error(
            "Google Play Services is not available on this device"
          );
        }
      }
      throw error;
    }
  }

  /**
   * Log out the current user
   * @returns Promise resolving to true if successful
   */
  public static async logout(): Promise<boolean> {
    try {
      if (PLATFORM === "web") {
        await webSignOut(this.auth as any);
      } else {
        if (GoogleSignin.getCurrentUser()) {
          await GoogleSignin.signOut();
        }
        await (this.auth as FirebaseAuthTypes.Module).signOut();
      }
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param email User email
   * @returns Promise resolving to true if successful
   */
  public static async resetPassword(email: string): Promise<boolean> {
    try {
      if (PLATFORM === "web") {
        await sendPasswordResetEmail(this.auth as any, email);
      } else {
        await (this.auth as FirebaseAuthTypes.Module).sendPasswordResetEmail(
          email
        );
      }
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get the current user's data from Firestore
   * @param firebaseUser The authenticated Firebase user
   * @returns Promise resolving to the user data
   */
  public static async getUserData(
    firebaseUser: WebUser | FirebaseAuthTypes.User
  ): Promise<FirebaseUserType> {
    let userData: FirebaseUserType = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullname: firebaseUser.displayName || "",
      avatar: firebaseUser.photoURL || "",
      role: null,
    };

    try {
      // Check if user exists in Firestore, create if not
      const existingUser =
        await FirestoreService.readDocument<FirebaseUserType>(
          "users",
          firebaseUser.uid
        );

      if (!existingUser) {
        // Create new user document
        const { uid, ...userDataWithoutUid } = userData;
        await FirestoreService.createDocument(
          "users",
          { ...userDataWithoutUid, role: null },
          firebaseUser.uid
        );
      } else if (existingUser.role) {
        // Update user data with role if it exists
        userData = {
          ...userData,
          role: existingUser.role,
        };
      }
    } catch (error: any) {
      throw error;
    }

    return userData;
  }

  /**
   * Update user role in Firestore
   * @param userId User ID
   * @param role New role
   * @returns Promise resolving when update is complete
   */
  public static async updateUserRole(
    userId: string,
    role: string
  ): Promise<void> {
    try {
      await FirestoreService.updateDocument("users", userId, {
        role: role.toLowerCase(),
      });
    } catch (error: any) {
      throw error;
    }
  }
}

export default AuthService;
