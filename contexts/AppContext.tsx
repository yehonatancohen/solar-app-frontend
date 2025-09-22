
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
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // To properly implement this, we need an endpoint like /users/me
                // For now, we'll decode the token or assume it's valid if present
                // This is a simplified example. In a real app, you'd call an endpoint to validate the token and get user data.
                // const userData = await api.getCurrentUser();
                // setUser(userData);
                // For demonstration purposes, we'll set a mock user if a token exists
                 setUser({ id: 1, name: 'Demo User', email: 'user@example.com', role: 'User', is_active: true });
            } catch (e) {
                console.error("Auth verification failed", e);
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
            await verifyAuth();
        } catch (err: any) {
            setError(err.message || 'Login failed.');
            throw err;
        }
    };

    const register = async (data: RegisterIn) => {
        setError(null);
        try {
            await api.register(data);
            // Optionally auto-login after registration
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
