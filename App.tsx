import React, { useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppContextProvider, useAuth, useTheme } from './contexts/AppContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { PaywallPage, HelpPage, NotificationsPage, NotFoundPage } from './pages/ExtraPages';
import { Layout } from './components/Layout';
import { Spinner } from './components/ui';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

const AppContent: React.FC = () => {
    const { theme } = useTheme();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <HashRouter>
            <MainRouter />
        </HashRouter>
    );
};

const MainRouter: React.FC = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // Unauthenticated users
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
            </Routes>
        );
    }

    // Authenticated but inactive users are directed to the paywall
    if (user && !user.is_active) {
        return (
            <Routes>
                <Route path="/paywall" element={<PaywallPage />} />
                <Route path="*" element={<Navigate to="/paywall" replace />} />
            </Routes>
        );
    }
    
    // Authenticated and active users get the full app layout
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsListPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/help" element={<HelpPage />} />
                {/* Redirect any attempts to access auth or paywall pages to the dashboard */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
                <Route path="/paywall" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
};

export default App;
