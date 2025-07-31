import Constants from "expo-constants";
import { MMKV, Mode } from "react-native-mmkv";
const appId =
  Constants.expoConfig?.android?.package || // Android bundle ID
  Constants.expoConfig?.ios?.bundleIdentifier;
const USER_DIRECTORY = `/data/user/0/${appId}/files/user_data`; // Example for Android
console.log("USER_DIRECTORY", USER_DIRECTORY);
export const storage = new MMKV({
  id: `user-storage`,
  //path: `${USER_DIRECTORY}/storage`,
  encryptionKey: "hunter2",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

// Storage keys constants for type safety
export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
  AUTH_TOKEN: "auth_token",
} as const;

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
