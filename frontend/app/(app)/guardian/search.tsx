import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { Pressable, Dimensions, Image, Platform, TouchableOpacity, SafeAreaView, View, Text, TextInput, ScrollView, ImageSourcePropType } from "react-native";
import { SearchBar } from "react-native-screens";
import { useFocusEffect } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Drawer } from 'expo-router/drawer';
const DefaultAvatar = require("@/assets/images/default_profile_pic.jpeg");
import ProfileCard2 from "@/components/profile/ProfileCard2";
import TypedProfileCard from "@/components/profile/TypedProfileCard";
import SidebarItem from "@/components/ClientSearch/SidebarItem";
import { useColorScheme } from "nativewind";
import { Colors } from '@/constants/Colors';

interface Freelancer {
  profilePhoto?: string | ImageSourcePropType;
  name: string;
  xp: number;
  mainRole: string;
  description: string;
}

interface Message {
  role: "User" | "System";
  text: string;
}

const TypingMessage = memo(
  ({ message }: { message: string }) => {
    const safeText = message || "Error: No message content";
    const [typedText, setTypedText] = useState('');
    const typingSpeed = 20;
    const { colorScheme } = useColorScheme();
   const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  
    
   useEffect(() => {
    let index = 0;
    setTypedText('');
    const interval = setInterval(() => {
      const char = safeText[index]; // capture NOW
      setTypedText((prev) => prev + char);
      index += 1;
      if (index >= safeText.length) {
        clearInterval(interval);
      }
    }, typingSpeed);
  
    return () => clearInterval(interval);
  }, [safeText]);
    

    return <Text style={{ color: theme.text, fontSize: 16 }}>{typedText}</Text>;
  },
  (prevProps, nextProps) => prevProps.message === nextProps.message
);





const Search = () => {
  const [query, setQuery] = useState<string>("");
  
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedOnce, setSubmittedOnce] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessageIndex, setTypedMessageIndex] = useState(-1);
  const [availableRoles, setAvailableRoles] = useState(["Web Dev", "AI Tutor", "UX Designer","UX Designer","UX Designer","UX Designer"]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [roleCount, setRoleCount] = useState(5);
    const [showRoleCountPicker, setShowRoleCountPicker] = useState(false);
    const [roleQuery, setRoleQuery] = useState('');
const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  const scrollViewRef = useRef<ScrollView>(null);

  const backendFreelancers: Freelancer[] = [
    {name: "Miles", mainRole: "Frontend Engineer", profilePhoto: DefaultAvatar, xp: 85, description: "Creative."},
    {name: "Bilal", mainRole: "Project Lead", profilePhoto: DefaultAvatar, xp: 100, description: "Experienced."},
    {name: "Zeke", mainRole: "Backend Engineer", profilePhoto: DefaultAvatar, xp: 98, description: "Machine."},
    {name: "Edna", mainRole: "UI/UX Designer", profilePhoto: DefaultAvatar, xp: 93, description: "Artistic."},
    {name: "Lily", mainRole: "Shadow", profilePhoto: DefaultAvatar, xp: 80, description: "Ambitious."},
  ]


  const allBackendFreelancers: Freelancer[] = [
    {name: "Miles", mainRole: "Frontend Engineer", profilePhoto: DefaultAvatar, xp: 85, description: "Creative."},
    {name: "Bilal", mainRole: "Project Lead", profilePhoto: DefaultAvatar, xp: 100, description: "Experienced."},
    {name: "Zeke", mainRole: "Backend Engineer", profilePhoto: DefaultAvatar, xp: 98, description: "Machine."},
    {name: "Edna", mainRole: "UI/UX Designer", profilePhoto: DefaultAvatar, xp: 93, description: "Artistic."},
    {name: "Lily", mainRole: "Shadow", profilePhoto: DefaultAvatar, xp: 80, description: "Ambitious."},
    {name: "Siddhant", mainRole: "Frontend Engineer", profilePhoto: DefaultAvatar, xp: 85, description: "Dawg."},
    {name: "Andrew", mainRole: "Project Manager???", profilePhoto: DefaultAvatar, xp: 1, description: "???"},
    {name: "Bryan", mainRole: "Backend Engineer", profilePhoto: DefaultAvatar, xp: 99, description: "Expert."},
    {name: "Krish", mainRole: "Tech Lead", profilePhoto: DefaultAvatar, xp: 99, description: "Leader."},
    {name: "Vikaas", mainRole: "Backend Engineer", profilePhoto: DefaultAvatar, xp: 92, description: "Multi Capable."},
  ]


  
  const chats: any[] = [{id: "1", name: "MilesFL"}, {id: "2", name: "JosephCL"}];
  const savedFreelancers: any[] = [{id: "1", name: "MilesTheG"}, {id: "2", name: "DK"}];
  const getFreelancers = (query: string): Freelancer[] => {
    return backendFreelancers;
  };

  const getSystemMessage = (query: string): Message => {
    return {role: "System", text: "I can definitely help you with that. Here's 5 freelancers that can help you with this prompt."};
  };

  const shuffleFreelancers = () => {
    const shuffled = [...allBackendFreelancers].sort(() => Math.random() - 0.5);
    const shufflingMessage: Message = {role: "System", text: "Randomizing freelancers for given prompt."}
    setMessages((prev) => [...prev, shufflingMessage]);
    setFreelancers(shuffled.slice(0, 5));
  };

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused
      return () => {
        // When the screen is unfocused
        setQuery(""); 
        setFreelancers([]);
        setMessages([]);
        setSubmittedOnce(false);
        setLoading(false); 
        
      };
    }, [])
  );

  useEffect(() => {
    if (messages.length > 0) {
      setTypedMessageIndex(messages.length - 1); // Animate only the last message
    }
  }, [messages.length]);
  
  

  const onSubmit = async (query: string) => {
    console.log("SUBMITTED: " + query);
    setSubmittedOnce(true);
    setLoading(true);
    setQuery("");
    const newMessage: Message = {role: "User", text: query};
    setMessages((prev) => [...prev, newMessage]);
    
    
    setTimeout(() => {
      const returnMessage = getSystemMessage(query);
      setMessages((prev) => [...prev, returnMessage]);
      const startingFive = getFreelancers(query);
      setFreelancers(startingFive);
      setLoading(false);
    }, 3000);
    

  };

  
  
  
  if (Platform.OS === 'web') {
    return (
      <View className="flex-row h-full">
        { /* Side Bar */}
        <View className="w-48 h-full justify-between py-4 px-2" style={{backgroundColor: theme.backgroundSecondary}}>
          
          {/* Top - Browse Button */}
          <TouchableOpacity className="flex-row items-center mb-6" onPress={() => console.log("Browsing nav")}>
            <Ionicons name="search" size={20} color={theme.text} />
            <Text className="ml-2 font-semibold text-base" style={{ color: theme.text }}>Browse</Text>
          </TouchableOpacity>
          {/* Middle - Chats and Saved Freelancers */}
          <View className="flex-1">
            {/* Chats Section */}
            <Text className="mb-2 text-xs font-semibold uppercase" style={{ color: theme.textSecondary }}>Chats</Text>
            {chats.map((chat, i) => (
              <SidebarItem key={i} label={chat.name} onPress={() => console.log(chat.id)} />
            ))}
            {/* Saved Freelancers Section */}
            <Text className="mt-4 mb-2 text-xs font-semibold uppercase" style={{ color: theme.textSecondary }}>Saved Freelancers</Text>       
            {savedFreelancers.map((freelancer, i) => (
              <SidebarItem key={i} label={freelancer.name} onPress={() => console.log(freelancer.id)} />
            ))}
          </View>
          <TouchableOpacity className="flex-row items-center mt-4" onPress={() => console.log("open settings")}>
            <Ionicons name="settings-outline" size={20} color={theme.textSecondary} />
            <Text className="ml-2 text-sm" style={{ color: theme.textSecondary }}>Settings</Text>
          </TouchableOpacity>
        </View>
        { /* Main Bar */}
        <ScrollView
          className="flex-1 px-10 pt-6"
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, justifyContent: 'flex-start' }} // Space for the input at the bottom
          ref={scrollViewRef}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        
        >
        {messages.map((msg, index) => (
            <View key={index} style={{flexDirection: "row", justifyContent: msg.role === "User" ? "flex-end" : "flex-start", marginVertical: 8}}>
              <View style={{padding: 12, borderRadius: 16, maxWidth: 700, backgroundColor: msg.role === "User" ? theme.backgroundSecondary: ''}}>
                { msg.role === 'System' ? (
                  index === typedMessageIndex ? (
                  <TypingMessage message={msg.text}/>
                ) : (
                  <Text style={{color:theme.text, fontSize: 16}}>{msg.text}</Text>
                  )
                ) : (
                  <Text style={{ color: theme.text, fontSize: 16}}>{msg.text}</Text>
                )}  
              </View>
            </View>
          ))}
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={true}
            
            snapToAlignment="start"
            decelerationRate="fast"
            style={{ backgroundColor: theme.background }}
            className="flex-1 flex-row w-full"
          >
          {loading ? (
              <Text style={{ color: theme.text }}>Loading freelancers...</Text>
            ) : submittedOnce && freelancers.length === 0 ? (
              <Text style={{color: theme.text}}> No freelancers found. </Text>
            ) : (
              freelancers.map((freelancer) => (
                <View key={freelancer.name} className="w-1/3">
                  <TypedProfileCard 
                  profilePhoto={freelancer.profilePhoto as ImageSourcePropType}
                  name={freelancer?.name}
                  xp={freelancer?.xp}
                  mainRole={freelancer?.mainRole}
                  secondaryRoles={["Good Friend"]}
                  description={freelancer?.description}
                  onChat={() => console.log("start chat clicked")}
                  onBookmark={() => console.log("bookmark clicked")}
                  onRandomize={() => console.log("Randomizing specific role")}
                />
              </View>
              ))
            )}
          </ScrollView>
          {/* Text Input Field*/}
          <View
          className={`absolute left-0 right-0 ${submittedOnce ? "bottom-4" : "top-1/2 -translate-y-1/2"}`}
          style={{
            backgroundColor: theme.background,
            paddingBottom: 20, // For a little spacing from the bottom
            zIndex: 999,
            justifyContent: "center", // Centering vertically and horizontally
            alignItems: "center",
          }}
          >
            <View className="flex-row items-center h-11 w-full max-w-4xl mx-auto border border-gray-300 bg-white px-4 py-2 shadow-sm" 
                style={{
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.input,
                }}>
              <TouchableOpacity onPress={() => shuffleFreelancers()} className="mr-3">
                <Ionicons name="shuffle" size={20} color={theme.textTertiary} />
              </TouchableOpacity>
              <TextInput 
                className="flex-1 text-base rounded"
                style={{
                  color: theme.text,
                  backgroundColor: theme.input,
                  fontSize: 16,
                  paddingBottom: 3,
                  lineHeight: 22,
                  paddingVertical: 0,
                  textAlignVertical: "center", // vertical centering
                }}
                editable={!loading}
                placeholder={loading ? "Thinking..." : "What are you looking to build?"}
                placeholderTextColor={theme.text}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => onSubmit(query)}
                cursorColor="#2164d9"
              />
              <TouchableOpacity onPress={() => onSubmit(query)} className="ml-3">
                <AntDesign name="arrowup" size={20} color={Colors.light.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
          { /* End of Text Input Field */ }
          
        </ScrollView>
        
        
      </View>
    );
  
  }

  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.9;
  const CARD_SPACING = 8;

  
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-col h-full">
        <ScrollView
          className="flex-1 px-10 pt-6"
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, justifyContent: 'flex-start' }} // Space for the input at the bottom
          ref={scrollViewRef}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        
        >

          {messages.map((msg, index) => (
            <View key={index} style={{flexDirection: "row", justifyContent: msg.role === "User" ? "flex-end" : "flex-start", marginVertical: 8}}>
              <View style={{padding: 12, borderRadius: 16, maxWidth: 300, backgroundColor: msg.role === "User" ? theme.backgroundSecondary: ''}}>
                { msg.role === 'System' ? (
                  index === typedMessageIndex ? (
                  <TypingMessage message={msg.text}/>
                ) : (
                  <Text style={{color:theme.text, fontSize: 16}}>{msg.text}</Text>
                  )
                ) : (
                  <Text style={{ color: theme.text, fontSize: 16}}>{msg.text}</Text>
                )}  
              </View>
            </View>
          ))}
        
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            style={{ backgroundColor: theme.background }}
            className="flex-1 flex-row w-full"
          >
            {loading ? (
              <Text style={{ color: theme.text }}>Loading freelancers...</Text>
            ) : submittedOnce && freelancers.length === 0 ? (
              <Text style={{color: theme.text}}> No freelancers found. </Text>
            ) : (
              freelancers.map((freelancer, index) => (
                <View key={freelancer.name} style={{ flex: 1, width: CARD_WIDTH }}>
                  { index === 0 ? (
                    <TypedProfileCard 
                    profilePhoto={freelancer.profilePhoto as ImageSourcePropType}
                    name={freelancer?.name}
                    xp={freelancer?.xp}
                    mainRole={freelancer?.mainRole}
                    secondaryRoles={["Good Friend"]}
                    description={freelancer?.description}
                    onChat={() => console.log("start chat clicked")}
                    onBookmark={() => console.log("bookmark clicked")}
                    onRandomize={() => console.log("Randomizing specific")}
                    />
                  ) : (
                    <ProfileCard2 
                    profilePhoto={freelancer.profilePhoto as ImageSourcePropType}
                    name={freelancer?.name}
                    xp={freelancer?.xp}
                    mainRole={freelancer?.mainRole}
                    secondaryRoles={["Good Friend"]}
                    description={freelancer?.description}
                    onChat={() => console.log("start chat clicked")}
                    onBookmark={() => console.log("bookmark clicked")}
                    onRandomize={() => console.log("randomize specific clicked")}
                    />
                  )}      
              </View>
              ))
            )}
          </ScrollView>
        


          {/* Text Input Start */}
          <View
  className={`absolute left-0 right-0 ${submittedOnce ? "bottom-4" : "top-1/2 -translate-y-1/2"}`}
  style={{
    backgroundColor: theme.background,
    paddingBottom: 20,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <View
    className="w-full max-w-4xl border shadow-sm rounded-xl"
    style={{
      borderColor: theme.inputBorder,
      backgroundColor: theme.input,
    }}
  >
    {/* Top text input bar */}
    <View className="flex-row items-center h-11 w-full px-4 py-2">
      <TouchableOpacity onPress={shuffleFreelancers} className="mr-3">
        <Ionicons name="shuffle" size={20} color={theme.textTertiary} />
      </TouchableOpacity>

      <TextInput
        className="flex-1 text-base"
        style={{
          color: theme.text,
          fontSize: 16,
          paddingBottom: 3,
          lineHeight: 22,
          paddingVertical: 0,
          textAlignVertical: "center",
        }}
        editable={!loading}
        placeholder={loading ? "Thinking..." : "What are you looking to build?"}
        placeholderTextColor={theme.text}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => onSubmit(query)}
        cursorColor="#2164d9"
      />

      <TouchableOpacity onPress={() => onSubmit(query)} className="ml-3">
        <AntDesign name="arrowup" size={20} color={Colors.light.textTertiary} />
      </TouchableOpacity>
    </View>

    {/* Filter Options Below */}
    <View className="flex-row justify-between px-4 pb-3 gap-4 flex-wrap">
      {/* Dropdown for number of roles */}
      <View className="flex-1">
        <Text className="text-sm text-gray-500 mb-1">Number of roles</Text>
        <TouchableOpacity
          onPress={() => setShowRoleCountPicker(true)}
          className="border px-3 py-2 rounded-lg"
          style={{ borderColor: theme.border }}
        >
          <Text className="text-base text-gray-800 dark:text-white">{roleCount}</Text>
        </TouchableOpacity>
        {showRoleCountPicker && (
          <View className="absolute bg-white dark:bg-gray-800 border mt-1 rounded shadow z-50">
            {[3, 5, 7, 10].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => {
                  setRoleCount(num);
                  setShowRoleCountPicker(false);
                }}
                className="px-4 py-2"
              >
                <Text className="text-base text-gray-800 dark:text-white">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Autocomplete search for role */}
      <View className="flex-1">
        <Text className="text-sm text-gray-500 mb-1">Filter by role</Text>
        <TextInput
          className="border px-3 py-2 rounded-lg"
          style={{ borderColor: theme.border, color: theme.text }}
          placeholder="e.g. Web Developer"
          placeholderTextColor={theme.textSecondary}
          value={roleQuery}
          onChangeText={setRoleQuery}
        />
        {roleQuery.length > 1 && (
          <View className="absolute bg-white dark:bg-gray-800 border mt-1 rounded shadow z-50 w-full">
            {availableRoles
              .filter((role) =>
                role.toLowerCase().includes(roleQuery.toLowerCase())
              )
              .map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => {
                    setSelectedRole(role);
                    setRoleQuery('');
                  }}
                  className="px-4 py-2"
                >
                  <Text className="text-base text-gray-800 dark:text-white">{role}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    </View>
  </View>
</View>


          {/* End of Text Input Field */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
  
}


export default Search;