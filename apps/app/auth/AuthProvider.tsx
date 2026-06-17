import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  completeProfile,
  getProfile,
  refreshTokens,
  sendOtp,
  verifyOtp,
  type CompleteProfilePayload,
  type Profile,
} from "@/lib/api";
import { clearTokens, getTokens, saveTokens } from "@/lib/storage";

type AuthState = {
  isHydrating: boolean;
  isAuthenticated: boolean;
  profileCompleted: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  phone: string | null;
};

type AuthContextType = AuthState & {
  bootstrap: () => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  finishProfile: (payload: CompleteProfilePayload) => Promise<void>;
  logout: () => Promise<void>;
  setPhone: (phone: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  isHydrating: true,
  isAuthenticated: false,
  profileCompleted: false,
  accessToken: null,
  refreshToken: null,
  profile: null,
  phone: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>(initialState);

  const setAuthTokens = async (accessToken: string, refreshToken: string) => {
    await saveTokens(accessToken, refreshToken);
    setState((prev) => ({
      ...prev,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }));
  };

  const hydrateProfile = async (accessToken: string) => {
    const profile = await getProfile(accessToken);
    setState((prev) => ({
      ...prev,
      profile,
      profileCompleted: profile.profileStatus === "PROFILE_COMPLETED",
      isAuthenticated: true,
    }));
    return profile;
  };

  const refreshSession = async () => {
    try {
      const currentRefreshToken =
        state.refreshToken || (await getTokens()).refreshToken;
      if (!currentRefreshToken) return false;

      const tokens = await refreshTokens(currentRefreshToken);
      await setAuthTokens(tokens.accessToken, tokens.refreshToken);
      await hydrateProfile(tokens.accessToken);
      return true;
    } catch {
      await logout();
      return false;
    }
  };

  const bootstrap = async () => {
    try {
      setState((prev) => ({ ...prev, isHydrating: true }));

      const { accessToken, refreshToken } = await getTokens();

      if (!accessToken || !refreshToken) {
        setState({
          ...initialState,
          isHydrating: false,
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }));

      try {
        await hydrateProfile(accessToken);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          const refreshed = await refreshSession();
          if (!refreshed) {
            await logout();
          }
        } else {
          await logout();
        }
      }
    } finally {
      setState((prev) => ({ ...prev, isHydrating: false }));
    }
  };

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOtp = async (phone: string) => {
    const response = await sendOtp({ phoneNumber: phone });
    console.log(response);
    setState((prev) => ({ ...prev, phone }));
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    const tokens = await verifyOtp({ phoneNumber: phone, otp });
    await setAuthTokens(tokens.accessToken, tokens.refreshToken);
    const profile = await hydrateProfile(tokens.accessToken);
    queryClient.setQueryData(["profile"], profile);
  };

  const finishProfile = async (payload: CompleteProfilePayload) => {
    if (!state.accessToken) throw new Error("No access token");
    await completeProfile(state.accessToken, payload);
    const profile = await getProfile(state.accessToken);
    setState((prev) => ({
      ...prev,
      profile,
      profileCompleted: true,
    }));
    queryClient.setQueryData(["profile"], profile);
  };

  const logout = async () => {
    await clearTokens();
    queryClient.clear();
    setState({
      ...initialState,
      isHydrating: false,
    });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      bootstrap,
      requestOtp,
      loginWithOtp,
      refreshSession,
      finishProfile,
      logout,
      setPhone: (phone) => setState((prev) => ({ ...prev, phone })),
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
}
