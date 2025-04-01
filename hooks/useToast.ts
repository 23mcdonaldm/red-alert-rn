import { Platform } from "react-native";
import { TypeOptions, toast as webToast } from "react-toastify";
import Toast from "react-native-toast-message";

export function useToast() {
  const showToast = (type: TypeOptions | undefined, message: string): void => {
    if (Platform.OS === "web") {
      webToast(message, {
        type: type,
      });
    } else {
      Toast.show({
        type,
        text1: message,
      });
    }
  };

  return { showToast };
}
