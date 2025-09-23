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
        <header className="bg-[var(--color-card-bg)] shadow-sm sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="lg:hidden mr-4 p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
                           <MenuIcon/>
                        </button>
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <SunIcon className="h-8 w-auto text-primary-600" />
                            <span className="ml-2 font-bold text-xl hidden sm:block">Solar Planner</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                        
                        <div className="relative" ref={notificationsRef}>
                            <button onClick={() => setNotificationsOpen(prev => !prev)} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] relative">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[var(--color-card-bg)]"></span>
                            </button>
                            {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-[var(--color-card-bg)] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="p-4 border-b border-[var(--color-border)]">
                                        <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                                    </div>
                                    <ul className="py-1 divide-y divide-[var(--color-border)]">
                                        <li className="p-4 hover:bg-[var(--color-bg-secondary)]">
                                            <p className="text-sm font-medium">Calculation complete for 'Downtown Rooftop'</p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">5 minutes ago</p>
                                        </li>
                                        <li className="p-4 hover:bg-[var(--color-bg-secondary)]">
                                            <p className="text-sm">Quote #Q2023-015 for 'Suburban Residence' expires in 3 days.</p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">1 hour ago</p>
                                        </li>
                                    </ul>
                                    <div className="p-2 border-t border-[var(--color-border)]">
                                        <Link to="/notifications" className="block text-center text-sm font-medium text-primary-600 hover:text-primary-500">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setUserMenuOpen(prev => !prev)} className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-[var(--color-card-bg)]">
                               <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                                    {user?.name ? (
                                        <span className="font-semibold text-[var(--color-text-secondary)]">{user.name.charAt(0)}</span>
                                    ) : (
                                        <UserCircleIcon className="h-6 w-6 text-[var(--color-text-secondary)]" />
                                    )}
                                </div>
                            </button>
                            {isUserMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--color-card-bg)] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Link to="/profile" className="block px-4 py-3 hover:bg-[var(--color-bg-secondary)]" onClick={() => setUserMenuOpen(false)}>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--color-primary-subtle-bg)] flex items-center justify-center">
                                                <span className="font-semibold text-lg text-[var(--color-primary-subtle-text)]">{user?.name?.charAt(0)}</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user?.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="py-1 border-t border-[var(--color-border)]">
                                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Logout
                                        </button>
                                    </div>
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
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
        isActive
          ? 'bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-subtle-text)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]'
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
            <aside className={`fixed top-0 left-0 w-64 h-full bg-[var(--color-card-bg)] border-r border-[var(--color-border)] z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 h-16 flex items-center border-b border-[var(--color-border)]">
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
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
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