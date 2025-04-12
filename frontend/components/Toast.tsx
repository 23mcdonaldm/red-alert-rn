import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

const CustomToast = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      {Platform.OS === "web" && (
        <ToastContainer theme={colorScheme === "dark" ? "dark" : "light"} />
      )}
      {Platform.OS !== "web" && (
        <View style={{ position: "absolute", width: "100%", zIndex: 1000 }}>
          <Toast
            config={{
              error: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#FF4444",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        !
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
              success: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#4CAF50",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
              info: (props) => (
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderRadius: 4,
                    padding: 16,
                    paddingRight: 40,
                    marginHorizontal: 16,
                    marginTop: 16,
                    position: "relative",
                    minHeight: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#2196F3",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        i
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {props.text1}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding: 8,
                    }}
                    onPress={() => Toast.hide()}
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,
                        fontSize: 20,
                        fontWeight: "200",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
            }}
            position="top"
            visibilityTime={3000}
            topOffset={Platform.OS === "ios" ? 50 : 30}
          />
        </View>
      )}
    </>
  );
};

export default CustomToast;