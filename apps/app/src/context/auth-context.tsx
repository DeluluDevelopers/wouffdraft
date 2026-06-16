import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, tokenStorage } from '../services/api';

export type ProfileStatus = 'REGISTERED' | 'VERIFIED' | 'PROFILE_COMPLETED' | 'SUSPENDED';

export interface LocationInfo {
  id: string;
  label: string;
  placeId: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface PetInfo {
  id: string;
  name: string;
  species: 'Dog' | 'Cat';
  breed?: string;
  ageMonths: number;
  gender: 'Male' | 'Female';
  vaccinationStatus: 'UpToDate' | 'Partial' | 'None';
  medicalConditions: boolean;
  medicalHistory?: string;
}

export interface UserProfile {
  id: string;
  phoneNumber: string;
  email?: string;
  name?: string;
  profileStatus: ProfileStatus;
  location?: LocationInfo[];
  pets?: PetInfo[];
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  profileStatus: ProfileStatus | null;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<{ success: boolean; message: string }>;
  completeProfile: (
    name: string,
    label: string,
    placeId: string,
    pets: Omit<PetInfo, 'id'>[]
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on launch
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          await loadProfile();
        }
      } catch (e) {
        console.error('Failed to load access token on bootstrap:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await apiFetch('/profile');
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        await tokenStorage.clearTokens();
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setUser(null);
      await tokenStorage.clearTokens();
    }
  };

  const sendOtp = async (phoneNumber: string) => {
    try {
      // First try to send-otp, if user is not found, attempt register
      try {
        const res = await apiFetch('/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ phoneNumber }),
          skipAuth: true,
        });
        return { success: true, message: res.message || 'OTP sent successfully' };
      } catch (err: any) {
        if (err.message && err.message.includes('User not found')) {
          // Attempt registration dynamically
          const regRes = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
            skipAuth: true,
          });
          return { success: true, message: regRes.message || 'Registered and OTP sent.' };
        }
        throw err;
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    try {
      const res = await apiFetch('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, otp }),
        skipAuth: true,
      });

      if (res.success && res.data) {
        const { accessToken, refreshToken } = res.data;
        await tokenStorage.saveTokens(accessToken, refreshToken);
        await loadProfile();
        return { success: true, message: 'OTP verified successfully' };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid or expired OTP' };
    }
  };

  const completeProfile = async (
    name: string,
    label: string,
    placeId: string,
    pets: Omit<PetInfo, 'id'>[]
  ) => {
    try {
      const res = await apiFetch('/profile', {
        method: 'POST',
        body: JSON.stringify({ name, label, placeId, pets }),
      });

      if (res.success) {
        await loadProfile();
        return { success: true, message: res.message || 'Profile completed successfully' };
      }
      return { success: false, message: res.message || 'Failed to complete profile' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to submit profile details' };
    }
  };

  const logout = async () => {
    await tokenStorage.clearTokens();
    setUser(null);
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const isAuthenticated = !!user;
  const profileStatus = user ? user.profileStatus : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        profileStatus,
        sendOtp,
        verifyOtp,
        completeProfile,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
