import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { googleLogin, getMe, loginUser, registerUser, AuthResponse } from "../services/authService";

interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    favorites: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (googleToken: string) => Promise<void>;
    emailLogin: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    setAuth: (data: AuthResponse) => void;
    updateFavorites: (favorites: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const userData = await getMe(token);
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (googleToken: string) => {
        setLoading(true);
        try {
            const data: AuthResponse = await googleLogin(googleToken);
            setToken(data.token);
            setUser(data.user as User);
            localStorage.setItem("token", data.token);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const emailLogin = async (userData: any) => {
        setLoading(true);
        try {
            const data: AuthResponse = await loginUser(userData);
            setToken(data.token);
            setUser(data.user as User);
            localStorage.setItem("token", data.token);
        } catch (error) {
            // console.error("Login failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any) => {
        setLoading(true);
        try {
            await registerUser(userData);
            // Don't auto-login, wait for verification (or inform user)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    const setAuth = (data: AuthResponse) => {
        setToken(data.token);
        setUser(data.user as User);
        localStorage.setItem("token", data.token);
    };

    const updateFavorites = (favorites: string[]) => {
        if (user) {
            setUser({ ...user, favorites });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                emailLogin,
                register,
                logout,
                setAuth,
                updateFavorites,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
