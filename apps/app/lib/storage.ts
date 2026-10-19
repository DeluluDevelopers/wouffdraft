import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// SecureStore has no web implementation; the web build (used for previews)
// falls back to localStorage.
const store = {
  get: (key: string) =>
    Platform.OS === "web"
      ? Promise.resolve(globalThis.localStorage?.getItem(key) ?? null)
      : SecureStore.getItemAsync(key),
  set: (key: string, value: string) =>
    Platform.OS === "web"
      ? Promise.resolve(globalThis.localStorage?.setItem(key, value))
      : SecureStore.setItemAsync(key, value),
  remove: (key: string) =>
    Platform.OS === "web"
      ? Promise.resolve(globalThis.localStorage?.removeItem(key))
      : SecureStore.deleteItemAsync(key),
};

export async function saveTokens(accessToken: string, refreshToken: string) {
  await store.set(ACCESS_TOKEN_KEY, accessToken);
  await store.set(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getTokens() {
  const [accessToken, refreshToken] = await Promise.all([store.get(ACCESS_TOKEN_KEY), store.get(REFRESH_TOKEN_KEY)]);

  return { accessToken, refreshToken };
}

export async function clearTokens() {
  await Promise.all([store.remove(ACCESS_TOKEN_KEY), store.remove(REFRESH_TOKEN_KEY)]);
}
