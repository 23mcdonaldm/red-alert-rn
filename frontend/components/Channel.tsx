
// TODO: Implement Channel component
// currently it is not configured properly and needs to figure it out
// once implementing chat app functionality


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import {
//   doc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   Firestore,
// } from "firebase/firestore";

// type User = {
//   uid: string;
//   displayName: string;
//   photoURL: string;
// };

// type MessageProps = {
//   text: string;
//   displayName: string;
// };

// type Message = {
//   id: string;
//   displayName: string;
// };

// const Message = ({ text, displayName }: MessageProps) => (
//   <View style={styles.messageContainer}>
//     <Text style={styles.messageSender}>{displayName}</Text>
//     <Text style={styles.messageText}>{text}</Text>
//   </View>
// );

// type ChannelProps = {
//   user: User;
//   db: Firestore;
//   chatId: string;
// };

// const Channel = ({ user, db, chatId }: ChannelProps) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const { uid, displayName, photoURL } = user;

//   useEffect(() => {
//     if (db && chatId) {
//       const q = query(
//         collection(doc(db, "chats", chatId), "messages"),
//         orderBy("createdAt", "asc")
//       );

//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const data = querySnapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));
//         setMessages(data as Message[]);
//       });

//       return unsubscribe;
//     }
//   }, [db, chatId]);

//   const handleOnSubmit = async () => {
//     if (db && chatId && newMessage.trim()) {
//       await addDoc(collection(doc(db, "chats", chatId), "messages"), {
//         text: newMessage,
//         createdAt: serverTimestamp(),
//         uid,
//         displayName,
//         photoURL,
//       });
//       setNewMessage("");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <Message {...(item)} />}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type your message..."
//         />
//         <TouchableOpacity
//           style={styles.sendButton}
//           onPress={handleOnSubmit}
//           disabled={!newMessage}
//         >
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Channel;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   messageContainer: {
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//     backgroundColor: "#f1f1f1",
//   },
//   messageSender: {
//     fontWeight: "bold",
//   },
//   messageText: {
//     marginTop: 2,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: "#ccc",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: "#E61F27",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   sendButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });
