import firebaseCoreService from "./FirebaseCoreService";
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  DocumentData,
  WithFieldValue,
  orderBy,
  limit,
  onSnapshot,
  QuerySnapshot as WebQuerySnapshot,
  CollectionReference,
  Query,
  Timestamp,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import { Platform } from "react-native";
import { useToast } from "@/hooks/useToast";
import { GroupChat } from "@/types/forum";

const PLATFORM = Platform.OS;
const DEFAULT_QUERY_LIMIT = 20;

class FirestoreService {
  private static firestore: FirebaseFirestoreTypes.Module | Firestore =
    firebaseCoreService.getFirestore();

  public static getFirestore() {
    return this.firestore;
  }

  private static getCollection(collectionName: string) {
    if (PLATFORM === "web") {
      return collection(this.firestore as Firestore, collectionName);
    } else {
      return firebase.firestore().collection(collectionName);
    }
  }

  private static buildQuery(
    baseQuery:
      | CollectionReference<DocumentData>
      | Query<DocumentData>
      | FirebaseFirestoreTypes.CollectionReference,
    field: string,
    operator: "==" | ">=" | "<=" | ">" | "<" | "array-contains",
    value: any,
    orderByField?: string,
    orderDirection: "asc" | "desc" = "asc",
    limitCount?: number,
    startAfterDoc?:
      | QueryDocumentSnapshot<DocumentData>
      | FirebaseFirestoreTypes.QueryDocumentSnapshot
  ) {
    if (PLATFORM === "web") {
      let q = query(
        baseQuery as CollectionReference<DocumentData> | Query<DocumentData>,
        where(field, operator, value)
      );
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      return q;
    } else {
      let q = (baseQuery as FirebaseFirestoreTypes.CollectionReference).where(
        field,
        operator,
        value
      ) as FirebaseFirestoreTypes.Query;
      if (orderByField) {
        q = q.orderBy(orderByField, orderDirection);
      }
      if (startAfterDoc) {
        q = q.startAfter(startAfterDoc);
      }
      if (limitCount) {
        q = q.limit(limitCount);
      }
      return q;
    }
  }

  /**
   * Query all groups with pagination support
   * @param lastVisible Last visible document for pagination
   * @param pageSize Number of documents to fetch per page
   * @returns Promise with array of groups and last visible document
   */
  public static async queryGroups(
    lastVisible?:
      | QueryDocumentSnapshot<DocumentData>
      | FirebaseFirestoreTypes.QueryDocumentSnapshot,
    pageSize: number = DEFAULT_QUERY_LIMIT
  ): Promise<{
    groups: GroupChat[];
    lastVisible:
      | QueryDocumentSnapshot<DocumentData>
      | FirebaseFirestoreTypes.QueryDocumentSnapshot
      | undefined;
  }> {
    try {
      const collection = this.getCollection("groupChats");

      let q;
      if (PLATFORM === "web") {
        q = query(
          collection as CollectionReference<DocumentData>,
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
        if (lastVisible) {
          q = query(q, startAfter(lastVisible));
        }
      } else {
        q = (collection as FirebaseFirestoreTypes.CollectionReference)
          .orderBy("createdAt", "desc")
          .limit(pageSize);
        if (lastVisible) {
          q = q.startAfter(lastVisible);
        }
      }

      const snapshot = await (PLATFORM === "web"
        ? getDocs(q as Query)
        : (q as FirebaseFirestoreTypes.Query).get());

      const groups = snapshot.docs.map((doc) => {
        const data = doc.data();
        const processedData = this.processTimestamps(data);

        // Ensure members array is properly initialized
        if (!Array.isArray(processedData.members)) {
          processedData.members = [];
        }

        // Ensure memberCount is properly set
        processedData.memberCount = processedData.members.length;

        return {
          id: doc.id,
          ...processedData,
        } as GroupChat;
      });

      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

      return {
        groups,
        lastVisible: lastVisibleDoc,
      };
    } catch (error: any) {
      console.error("Error querying groups:", error);
      useToast().showToast("error", error.message || "Error fetching groups");
      throw error;
    }
  }

  private static processTimestamps(data: any): any {
    const processedData = { ...data };

    Object.keys(processedData).forEach((key) => {
      const value = processedData[key];
      if (!value || typeof value !== "object") {
        return;
      }

      // Handle React Native Firebase Timestamp
      if (PLATFORM !== "web" && value._seconds !== undefined) {
        try {
          processedData[key] = new Date(value._seconds * 1000);
        } catch (e) {
          console.warn(`Failed to convert RN timestamp for key ${key}:`, e);
          processedData[key] = null;
        }
        return;
      }

      // Handle Web Firestore Timestamp
      if (PLATFORM === "web" && value instanceof Timestamp) {
        try {
          processedData[key] = value.toDate();
        } catch (e) {
          console.warn(`Failed to convert web timestamp for key ${key}:`, e);
          processedData[key] = null;
        }
        return;
      }

      // Handle Firestore timestamp object with seconds and nanoseconds
      if (value.seconds !== undefined && value.nanoseconds !== undefined) {
        try {
          processedData[key] = new Date(
            value.seconds * 1000 + value.nanoseconds / 1000000
          );
        } catch (e) {
          console.warn(
            `Failed to convert Firestore timestamp for key ${key}:`,
            e
          );
          processedData[key] = null;
        }
        return;
      }

      // Handle any timestamp with toDate() method
      if (typeof value.toDate === "function") {
        try {
          processedData[key] = value.toDate();
        } catch (e) {
          console.warn(
            `Failed to convert timestamp with toDate() for key ${key}:`,
            e
          );
          processedData[key] = null;
        }
        return;
      }

      // Handle nested objects and arrays
      if (Array.isArray(value)) {
        processedData[key] = value.map((item) =>
          typeof item === "object" ? this.processTimestamps(item) : item
        );
      } else if (typeof value === "object") {
        processedData[key] = this.processTimestamps(value);
      }
    });

    return processedData;
  }

  /**
   * Create a new document in a collection
   * @param collectionName Name of the collection
   * @param data Data to be stored
   * @param docId Optional document ID. If not provided, Firestore will auto-generate one
   * @returns Promise with the document ID
   */
  public static async createDocument<T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>,
    docId?: string
  ): Promise<string> {
    try {
      if (PLATFORM === "web") {
        const firestore = this.firestore as Firestore;
        if (docId) {
          await setDoc(doc(firestore, collectionName, docId), data);
          return docId;
        } else {
          const docRef = await addDoc(
            collection(firestore, collectionName),
            data
          );
          return docRef.id;
        }
      } else {
        const firestore = this.firestore as FirebaseFirestoreTypes.Module;
        if (docId) {
          await firestore.collection(collectionName).doc(docId).set(data);
          return docId;
        } else {
          const docRef = await firestore.collection(collectionName).add(data);
          return docRef.id;
        }
      }
    } catch (error: any) {
      useToast().showToast("error", error.message || "Error creating document");
      throw error;
    }
  }

  /**
   * Read a document from a collection
   * @param collectionName Name of the collection
   * @param docId Document ID
   * @returns Promise with the document data or null if not found
   */
  public static async readDocument<T extends DocumentData>(
    collectionName: string,
    docId: string
  ): Promise<T | null> {
    try {
      if (PLATFORM === "web") {
        const firestore = this.firestore as Firestore;
        const docRef = doc(firestore, collectionName, docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as T) : null;
      } else {
        const firestore = this.firestore as FirebaseFirestoreTypes.Module;
        const docRef = await firestore
          .collection(collectionName)
          .doc(docId)
          .get();
        return docRef.exists ? (docRef.data() as T) : null;
      }
    } catch (error: any) {
      useToast().showToast("error", error.message || "Error reading document");
      throw error;
    }
  }

  /**
   * Update a document in a collection
   * @param collectionName Name of the collection
   * @param docId Document ID
   * @param data Partial data to update
   * @returns Promise that resolves when the update is complete
   */
  public static async updateDocument<T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: Partial<WithFieldValue<T>>
  ): Promise<void> {
    try {
      if (PLATFORM === "web") {
        const firestore = this.firestore as Firestore;
        const docRef = doc(firestore, collectionName, docId);
        await updateDoc(docRef, data as Record<string, any>);
      } else {
        const firestore = this.firestore as FirebaseFirestoreTypes.Module;
        await firestore
          .collection(collectionName)
          .doc(docId)
          .update(data as Record<string, any>);
      }
    } catch (error: any) {
      useToast().showToast("error", error.message || "Error updating document");
      throw error;
    }
  }

  /**
   * Delete a document from a collection
   * @param collectionName Name of the collection
   * @param docId Document ID
   * @returns Promise that resolves when the deletion is complete
   */
  public static async deleteDocument(
    collectionName: string,
    docId: string
  ): Promise<void> {
    try {
      if (PLATFORM === "web") {
        const firestore = this.firestore as Firestore;
        const docRef = doc(firestore, collectionName, docId);
        await deleteDoc(docRef);
      } else {
        const firestore = this.firestore as FirebaseFirestoreTypes.Module;
        await firestore.collection(collectionName).doc(docId).delete();
      }
    } catch (error: any) {
      useToast().showToast("error", error.message || "Error deleting document");
      throw error;
    }
  }

  /**
   * Query documents from a collection
   * @param collectionName Name of the collection
   * @param field Field to query
   * @param operator Comparison operator
   * @param value Value to compare against
   * @param orderByField Optional field to order by
   * @param orderDirection Optional order direction
   * @param limitCount Optional limit on the number of documents
   * @returns Promise with array of matching documents
   */
  public static async queryDocuments<T extends DocumentData>(
    collectionName: string,
    field: string,
    operator: "==" | ">=" | "<=" | ">" | "<" | "array-contains",
    value: any,
    orderByField?: string,
    orderDirection: "asc" | "desc" = "asc",
    limitCount?: number
  ): Promise<T[]> {
    try {
      const collection = this.getCollection(collectionName);
      const q = this.buildQuery(
        collection,
        field,
        operator,
        value,
        orderByField,
        orderDirection,
        limitCount
      );

      const snapshot = await (PLATFORM === "web"
        ? getDocs(q as Query)
        : (q as FirebaseFirestoreTypes.Query).get());

      return snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        const processedData = { ...data };

        Object.keys(processedData).forEach((key) => {
          const value = processedData[key];
          if (!value || typeof value !== "object") {
            return;
          }

          // Handle React Native Firebase Timestamp
          if (PLATFORM !== "web" && value._seconds !== undefined) {
            try {
              processedData[key] = new Date(value._seconds * 1000);
            } catch (e) {
              console.warn(`Failed to convert RN timestamp for key ${key}:`, e);
              processedData[key] = null;
            }
            return;
          }

          // Handle Web Firestore Timestamp
          if (PLATFORM === "web" && value instanceof Timestamp) {
            try {
              processedData[key] = value.toDate();
            } catch (e) {
              console.warn(
                `Failed to convert web timestamp for key ${key}:`,
                e
              );
              processedData[key] = null;
            }
            return;
          }

          // Fallback for any timestamp-like object
          if (typeof value.toDate === "function") {
            try {
              processedData[key] = value.toDate();
            } catch (e) {
              console.warn(
                `Failed to convert timestamp-like object for key ${key}:`,
                e
              );
              processedData[key] = null;
            }
          }
        });

        return {
          id: doc.id,
          ...processedData,
        } as unknown as T;
      });
    } catch (error: any) {
      console.error("Firestore query error:", error);
      useToast().showToast(
        "error",
        error.message || "Error querying documents"
      );
      throw error;
    }
  }

  /**
   * Listen for changes in a collection
   * @param collectionName Name of the collection
   * @param onNext Callback function to handle changes
   * @param onError Optional error handler
   * @param onCompletion Optional completion handler
   * @returns Unsubscribe function
   */
  public static onSnapshot(
    collectionName: string,
    onNext: (
      snapshot:
        | WebQuerySnapshot<DocumentData>
        | FirebaseFirestoreTypes.QuerySnapshot
    ) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void {
    const collection = this.getCollection(collectionName);
    if (PLATFORM === "web") {
      return onSnapshot(
        collection as CollectionReference<DocumentData>,
        onNext,
        onError,
        onCompletion
      );
    } else {
      return (
        collection as FirebaseFirestoreTypes.CollectionReference
      ).onSnapshot(onNext, onError, onCompletion);
    }
  }
}

export default FirestoreService;
