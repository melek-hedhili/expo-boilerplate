import { storage, STORAGE_KEYS } from "@/lib/storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Types
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isUserAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  isSignUpLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
}

// API functions
const API_BASE_URL = "https://reqres.in/api";
const API_KEY = "reqres-free-v1";

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user,
  };
};

const signUpUser = async (
  credentials: SignUpCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Sign up failed");
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user,
  };
};

const getUserProfile = async (token: string, id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data = await response.json();
  return data.data;
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Fetch user profile when token is available but no user
  const {
    data: userData,
    isLoading: isProfileLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["userProfile", token],
    queryFn: () => getUserProfile(token!, 1), // Use default user ID of 1
    enabled: !!token && !user, // Only fetch when we have token but no user
  });

  // Handle user data changes
  useEffect(() => {
    if (isSuccess && userData) {
      setUser(userData);
    }
  }, [isSuccess, userData]);

  // Handle profile fetch errors
  useEffect(() => {
    if (error && token) {
      signOut();
    }
  }, [error, token]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.token);
      // Don't set user here, it will be fetched from profile
      storage.set(STORAGE_KEYS.AUTH_TOKEN, data.token);
    },
    onError: (error: Error) => {
      Alert.alert("Login Failed", error.message);
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      setToken(data.token);
      // Don't set user here, it will be fetched from profile
      storage.set(STORAGE_KEYS.AUTH_TOKEN, data.token);
    },
    onError: (error: Error) => {
      Alert.alert("Sign Up Failed", error.message);
    },
  });

  const signIn = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const signUp = async (credentials: SignUpCredentials) => {
    await signUpMutation.mutateAsync(credentials);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    storage.delete(STORAGE_KEYS.AUTH_TOKEN);
  };

  const isUserAuthenticated = !!token && !!user;
  const isLoading = isInitializing || isProfileLoading;

  const value: AuthContextType = {
    user,
    isUserAuthenticated,
    isLoading,
    isLoginLoading: loginMutation.isPending,
    isSignUpLoading: signUpMutation.isPending,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
