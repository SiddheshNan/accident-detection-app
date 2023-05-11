import { Dimensions, Platform, PixelRatio, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 320; // based on iphone 5s's scale

export const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const API_URL = "http://192.168.1.21:4050/api";
export const WS_URL = "ws://192.168.1.21:4050/api/user/dashboard?_id=";

export let APP_SESSION = {
  username: "",
  _id: "",
};

export const showAlert = (title, message) => {
  Alert.alert(title, message, [
    {
      text: "OK",
      style: "default",
    },
  ]);
};

export const createLocalTime = (time) => {
  if (!time) return "Never";

  return new Date(time).toLocaleString("en-IN").toUpperCase();
};
