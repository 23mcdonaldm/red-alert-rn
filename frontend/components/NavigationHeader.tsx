import type React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import type { NavigationProp } from "@react-navigation/native";
import { NavigationHeaderProps } from "@/types/navigation";
import ProfileImage from "./ProfileImage";

type NavigationItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  filledIcon: keyof typeof Ionicons.glyphMap;
};

type RightAction = {
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: boolean;
  onPress: (navigation: NavigationProp<any>) => void;
  customComponent?: React.ReactNode;
};

export default function NavigationHeader({
  navigation,
  currentRoute,
  logoSource,
  navigationItems = [],
  rightActions = [],
}: NavigationHeaderProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const screenWidth = Dimensions.get("window").width;

  const isCompact = screenWidth < 420 || navigationItems.length + rightActions.length > 4;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        {/* Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.logoContainer}
        >
          <Image source={logoSource} resizeMode="contain" style={styles.logo} />
        </TouchableOpacity>

        {/* Navigation and Actions */}
        <View style={styles.navActionsContainer}>
          {/* Navigation Items */}
          <View style={styles.navItemsContainer}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => navigation.navigate(item.name === "home" ? "index" : item.name)}
                style={[styles.iconWrapper, { marginLeft: isCompact ? 12 : 20 }]}
              >
                <Ionicons
                  name={currentRoute === item.name ? item.filledIcon : item.icon}
                  size={24}
                  color={currentRoute === item.name ? colors.primary : colors.text}
                />
                {currentRoute === item.name && (
                  <View
                    style={[styles.activeIndicator, { backgroundColor: colors.primary }]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Actions */}
          <View style={styles.rightActionsContainer}>
            {rightActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => action.onPress(navigation)}
                style={[styles.iconWrapper, { marginLeft: isCompact ? 12 : 20 }]}
              >
                {action.customComponent ? (
                  action.customComponent
                ) : action.icon === "person" ? (
                  <ProfileImage size={24} />
                ) : (
                  <View>
                    <Ionicons
                      name={action.icon as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color={colors.text}
                    />
                    {action.badge && <View style={[styles.badge, { backgroundColor: colors.primary }]} />}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    width: "100%",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "web" ? 16 : 12,
  },
  logoContainer: {
    minWidth: 80,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 30,
  },
  navActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  iconWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
