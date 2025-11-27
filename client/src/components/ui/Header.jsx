import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header({ onMenuClick, sidebarOpen }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userProfile');

        // Redirect to login page
        navigate('/login', { replace: true });
    };

    const handleProfileClick = () => {
        setShowProfileMenu(false);
        navigate('/profile');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search members, teachers, visitors..."
                        className="bg-transparent border-none outline-none ml-2 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="User menu"
                    >
                        <div className="w-8 h-8 gradient-blue rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-700">Administrator</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
