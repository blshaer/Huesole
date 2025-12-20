import axios from "axios";

export interface AuthResponse {
    success: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        picture?: string;
        favorites: string[];
    };
    token: string;
    message?: string;
}

const API_URL = "http://localhost:5000/api/auth";

export const googleLogin = async (token: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/google`, { token });
    return response.data as AuthResponse;
};

export const registerUser = async (userData: any): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data as { success: boolean; message: string };
};

export const loginUser = async (userData: any): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data as AuthResponse;
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; data: string }> => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data as { success: boolean; data: string };
};

export const resetPassword = async (password: string, token: string): Promise<AuthResponse> => {
    const response = await axios.put(`${API_URL}/reset-password/${token}`, { password });
    return response.data as AuthResponse;
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/verify-email/${token}`);
    return response.data as AuthResponse;
};

export const getMe = async (token: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const toggleFavorite = async (gradientName: string): Promise<{ success: boolean; favorites: string[] }> => {
    const token = localStorage.getItem("token");
    const response = await axios.put<{ success: boolean; favorites: string[] }>(
        `${API_URL}/toggle-favorite`,
        { gradientName },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_URL}/resend-verification`, { email });
    return response.data as { success: boolean; message: string };
};
