import axios from "@/shared/lib/axios";

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    favorites: string[];
    dislikes: string[];
    role: "user" | "admin";
  };
  token: string;
  message?: string;
}

const AUTH_URL = "/auth";

export const googleLogin = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_URL}/google`, { token });
  return response.data as AuthResponse;
};

export const registerUser = async (
  userData: any,
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${AUTH_URL}/register`, userData);
  return response.data as { success: boolean; message: string };
};

export const loginUser = async (userData: any): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_URL}/login`, userData);
  return response.data as AuthResponse;
};

export const forgotPassword = async (
  email: string,
): Promise<{ success: boolean; data: string }> => {
  const response = await axios.post(`${AUTH_URL}/forgot-password`, { email });
  return response.data as { success: boolean; data: string };
};

export const resetPassword = async (
  password: string,
  token: string,
): Promise<AuthResponse> => {
  const response = await axios.put(`${AUTH_URL}/reset-password/${token}`, {
    password,
  });
  return response.data as AuthResponse;
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await axios.get(`${AUTH_URL}/verify-email/${token}`);
  return response.data as AuthResponse;
};

export const getMe = async (): Promise<any> => {
  const response = await axios.get(`${AUTH_URL}/me`);
  return response.data;
};

export const toggleFavorite = async (
  gradientName: string,
): Promise<{ success: boolean; favorites: string[] }> => {
  const response = await axios.put<{ success: boolean; favorites: string[] }>(
    `${AUTH_URL}/toggle-favorite`,
    { gradientName }
  );
  return response.data;
};

export const toggleDislike = async (
  gradientName: string,
): Promise<{ success: boolean; dislikes: string[] }> => {
  const response = await axios.put<{ success: boolean; dislikes: string[] }>(
    `${AUTH_URL}/toggle-dislike`,
    { gradientName }
  );
  return response.data;
};

export const resendVerification = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${AUTH_URL}/resend-verification`, {
    email,
  });
  return response.data as { success: boolean; message: string };
};
