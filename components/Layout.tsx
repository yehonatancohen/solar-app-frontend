import React, { useState, Fragment, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth, useTheme } from '../contexts/AppContext';
import { Button, SunIcon, MoonIcon, BellIcon, UserCircleIcon } from './ui';

// --- Icons for Sidebar ---
const DashboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ProjectsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const HelpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MenuIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;

// --- Header ---
const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="lg:hidden mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                           <MenuIcon/>
                        </button>
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <SunIcon className="h-8 w-auto text-primary-600" />
                            <span className="ml-2 font-bold text-xl hidden sm:block">Solar Planner</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                        
                        <div className="relative" ref={notificationsRef}>
                            <button onClick={() => setNotificationsOpen(prev => !prev)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                            </button>
                            {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="p-4 border-b dark:border-gray-600">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                                    </div>
                                    <ul className="py-1 divide-y divide-gray-100 dark:divide-gray-600">
                                        <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <p className="text-sm font-medium">Calculation complete for 'Downtown Rooftop'</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 minutes ago</p>
                                        </li>
                                        <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <p className="text-sm">Quote #Q2023-015 for 'Suburban Residence' expires in 3 days.</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                                        </li>
                                    </ul>
                                    <div className="p-2 border-t dark:border-gray-600">
                                        <Link to="/notifications" className="block text-center text-sm font-medium text-primary-600 hover:text-primary-500">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setUserMenuOpen(prev => !prev)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <UserCircleIcon className="h-6 w-6" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                                        <p className="font-semibold">{user?.name}</p>
                                        <p className="truncate text-gray-500 dark:text-gray-400">{user?.email}</p>
                                    </div>
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// --- Sidebar ---
const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
    // This is the correct v6+ syntax for active NavLinks
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
          : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
      }`;
  
    return (
      <NavLink to={to} end className={navLinkClasses}>
        <span className="mr-3">{icon}</span>
        {children}
      </NavLink>
    );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
         <>
            {/* Overlay for mobile */}
            <div className={`fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 h-16 flex items-center border-b dark:border-gray-700">
                    {/* Header space */}
                </div>
                <nav className="p-4 space-y-2">
                    <NavItem to="/" icon={<DashboardIcon />}>Dashboard</NavItem>
                    <NavItem to="/projects" icon={<ProjectsIcon />}>Projects</NavItem>
                    <NavItem to="/notifications" icon={<BellIcon />}>Notifications</NavItem>
                    <NavItem to="/help" icon={<HelpIcon />}>Help</NavItem>
                </nav>
            </aside>
        </>
    );
};


// --- Layout ---
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};