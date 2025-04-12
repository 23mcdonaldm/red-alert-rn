import { Timestamp as WebTimestamp } from "firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// Union type for Timestamp that works on both platforms
export type Timestamp = WebTimestamp | FirebaseFirestoreTypes.Timestamp;

export interface GroupChat {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
  createdBy: string;
  createdByName: string;
  members: GroupChatMember[];
  lastMessage?: Message;
  imageUrl?: string;
  isPublic: boolean;
  memberCount: number;
}

export interface Message {
  id: string;
  groupId: string;
  text: string;
  senderId: string;
  senderName: string;
  senderImageUrl?: string;
  timestamp: Timestamp;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
  };
  reactions?: {
    [emoji: string]: string[]; // userIds who reacted with this emoji
  };
}

export interface GroupChatMember {
  userId: string;
  userName: string;
  userImageUrl?: string;
  joinedAt: Timestamp;
  role: "admin" | "member";
  lastSeen?: Timestamp;
}

export interface MessagePagination {
  lastVisible: Timestamp | null;
  hasMore: boolean;
  messages: Message[];
}

export interface GroupChatFilters {
  searchQuery?: string;
  isPublic?: boolean;
  memberCount?: {
    min?: number;
    max?: number;
  };
  createdAfter?: Timestamp;
  createdBefore?: Timestamp;
}
