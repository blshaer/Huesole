import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthResponse,
  getMe,
  googleLogin,
  loginUser,
  registerUser,
} from "../services/authService";

const ADMIN_EMAIL = "blshaer@outlook.com";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  favorites: string[];
  role: "user" | "admin";
  isBanned?: boolean;
  banMessage?: string;
  createdAt?: string;
}

interface BanInfo {
  isBanned: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (googleToken: string) => Promise<void>;
  emailLogin: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setAuth: (data: AuthResponse) => void;

  updateFavorites: (favorites: string[]) => void;
  updateUser: (userData: Partial<User>) => void;

  isSignInOpen: boolean;
  closeSignIn: () => void;

  banInfo: BanInfo | null;
  resetBanInfo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Force admin role if email matches
 */
const normalizeUserRole = (user: User): User => {
  if (user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return { ...user, role: "admin" };
  }
  return user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);

  const resetBanInfo = () => setBanInfo(null);
  const closeSignIn = () => setIsSignInOpen(false);

  /**
   * Restore session
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // If user is already set (e.g. from just-performed login), avoid redundant call
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(normalizeUserRole(userData));
      } catch (error: any) {
        if (
          error.response?.status === 403 &&
          error.response?.data?.isBanned
        ) {
          setBanInfo({
            isBanned: true,
            message: error.response.data.message,
          });
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  /**
   * Google login
   */
  const login = async (googleToken: string) => {
    setLoading(true);
    try {
      const data: AuthResponse = await googleLogin(googleToken);
      setAuth(data);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Email login
   */
  const emailLogin = async (userData: any) => {
    setLoading(true);
    try {
      const data: AuthResponse = await loginUser(userData);
      setAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      await registerUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  /**
   * Centralized auth setter
   */
  const setAuth = (data: AuthResponse) => {
    const normalizedUser = normalizeUserRole(data.user as User);

    setToken(data.token);
    setUser(normalizedUser);
    localStorage.setItem("token", data.token);
  };

  const updateFavorites = (favorites: string[]) => {
    if (user) {
      setUser({ ...user, favorites });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAuthenticated = useMemo(
    () => Boolean(token && user),
    [token, user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        isAuthenticated,
        isLoading: loading,

        login,
        emailLogin,
        register,
        logout,
        setAuth,

        updateFavorites,
        updateUser,

        isSignInOpen,
        closeSignIn,

        banInfo,
        resetBanInfo,
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
