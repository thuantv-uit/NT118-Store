import { Platform } from "react-native";

// Default host for development. If you run the app on a physical device,
// replace DEFAULT_DEV_HOST with your machine IP (e.g. 192.168.x.y).
const DEFAULT_DEV_HOST = "192.168.1.173";

// Android emulator (classic) maps localhost of the host machine to 10.0.2.2
const EMULATOR_ANDROID_HOST = "10.0.2.2";

const host = Platform.OS === "android" ? EMULATOR_ANDROID_HOST : DEFAULT_DEV_HOST;

export const API_URL = `http://${host}:5001/api`;

// Notes:
// - If you use a physical device, set DEFAULT_DEV_HOST to your computer's LAN IP
//   or change this file to export a different host. Restart the app after changes.