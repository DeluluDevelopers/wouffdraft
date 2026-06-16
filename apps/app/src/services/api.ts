import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Keys for storing tokens
const ACCESS_TOKEN_KEY = 'woff_access_token';
const REFRESH_TOKEN_KEY = 'woff_refresh_token';

// Dynamically resolve base API URL for development
const getBaseUrl = (): string => {
  // If running on web, we assume backend is at localhost:3000
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api/v1';
  }

  // If running on mobile emulator/device, dynamically retrieve developer machine's IP
  let devIp = 'localhost';
  if (Constants.expoConfig?.hostUri) {
    const parts = Constants.expoConfig.hostUri.split(':');
    if (parts[0]) {
      devIp = parts[0];
    }
  } else if (Platform.OS === 'android') {
    devIp = '10.0.2.2'; // Standard loopback for Android Emulator
  }

  return `http://${devIp}:3000/api/v1`;
};

export const API_BASE_URL = getBaseUrl();

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

// Token helper methods
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Universal fetch-based API client with automatic token refreshing.
 */
export async function apiFetch(endpoint: string, options: ApiRequestOptions = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach token if not skipped
  if (!options.skipAuth) {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 401 token expired
    if (response.status === 401 && !options.skipAuth) {
      // If we are already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            headers.set('Authorization', `Bearer ${newToken}`);
            resolve(apiFetch(endpoint, options));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          // Attempt token refresh
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData.data;

            await tokenStorage.saveTokens(newAccessToken, newRefreshToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);

            // Retry original request
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            return apiFetch(endpoint, options);
          }
        } catch (refreshErr) {
          console.error('Failed to refresh token:', refreshErr);
        }
      }

      // If refresh fails or no refresh token is stored, clear tokens and let caller handle authorization error
      isRefreshing = false;
      await tokenStorage.clearTokens();
    }

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || 'Something went wrong');
    }
    return json;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
  }
}
