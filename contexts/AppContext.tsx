import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { UserOut, LoginIn, RegisterIn } from '../types';

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

    const verifyAuth = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // Use the /auth/me endpoint to verify token and get fresh user data
                const userData = await api.getMe();
                setUser(userData);
            } catch (err) {
                // If token is invalid or expired, clear it
                console.error("Token verification failed:", err);
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
            localStorage.setItem('authToken', access_token);
            // After login, fetch the user's data from the /auth/me endpoint
            const userData = await api.getMe();
            setUser(userData);
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
            // Auto-login after successful registration to get the token and user data
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