import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export type NavigationItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  filledIcon: keyof typeof Ionicons.glyphMap;
};

export type RightAction = {
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: boolean;
  onPress: (navigation: NavigationProp<any>) => void;
  customComponent?: React.ReactNode;
};

export type NavigationHeaderProps = {
  navigation: NavigationProp<any>;
  currentRoute: string;
  logoSource: any;
  navigationItems: NavigationItem[];
  rightActions: RightAction[];
};

export type Role = "student" | "administrator" | "guardian";
