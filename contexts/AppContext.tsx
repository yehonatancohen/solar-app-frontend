import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { UserOut, LoginIn, RegisterIn } from '../types';

// --- JWT Decoding ---
/**
 * Decodes a JWT token to extract its payload without verifying the signature.
 * @param token The JWT token string.
 * @returns The decoded payload object or null if decoding fails.
 */
function decodeJwt<T>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

// Expected payload from the JWT from the backend
interface JwtPayload {
    sub: string; // User ID
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    exp?: number; // Expiration time
}


// --- Theme Context ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

// --- Auth Context ---
interface AuthContextType {
    user: UserOut | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginIn) => Promise<void>;
    register: (data: RegisterIn) => Promise<void>;
    logout: () => void;
    error: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// --- App Context Provider (Combined) ---
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Theme state
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Auth state
    const [user, setUser] = useState<UserOut | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const verifyAuth = useCallback(() => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (token) {
            const payload = decodeJwt<JwtPayload>(token);
            // Check if token is valid and not expired
            if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
                const userData: UserOut = {
                    id: parseInt(payload.sub, 10),
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    is_active: payload.is_active,
                };
                setUser(userData);
            } else {
                localStorage.removeItem('authToken');
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    const login = async (credentials: LoginIn) => {
        setError(null);
        try {
            const { access_token } = await api.login(credentials);
            const payload = decodeJwt<JwtPayload>(access_token);

            if (payload) {
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    throw new Error("Login failed: Expired token received.");
                }
                localStorage.setItem('authToken', access_token);
                const userData: UserOut = {
                    id: parseInt(payload.sub, 10),
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    is_active: payload.is_active,
                };
                setUser(userData);
            } else {
                 throw new Error("Login failed: Could not decode or invalid token received.");
            }
        } catch (err: any) {
            setError(err.message || 'Login failed.');
            localStorage.removeItem('authToken');
            setUser(null);
            throw err;
        }
    };

    const register = async (data: RegisterIn) => {
        setError(null);
        try {
            await api.register(data);
            // Auto-login after successful registration to get the token
            await login({ email: data.email, password: data.password });
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    const authValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
    };

    return (
        <AuthContext.Provider value={authValue}>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
};