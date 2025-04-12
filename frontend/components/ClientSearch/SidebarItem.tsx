import {View, TouchableOpacity, Text, Pressable } from "react-native";

import { useColorScheme } from "nativewind";
import { Colors } from '@/constants/Colors';

const SidebarItem = ({ label, onPress }: { label: any, onPress: any}) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const theme = Colors[isDark ? "dark" : "light"];

    return (

    <View className="px-3 rounded mb-1">
      <Pressable className=""
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginBottom: 4,
      })}
    >
      <Text style={{ color: theme.text, fontSize: 14 }}>{label}</Text>
    </Pressable>
    </View>
    );
    

}

export default SidebarItem;


