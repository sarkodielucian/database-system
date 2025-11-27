import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    GraduationCap,
    ClipboardCheck,
    Wallet,
    MessageSquare,
    Package,
    FileText,
    Settings,
    UsersRound,
    X,
    Church
} from 'lucide-react';

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/members', icon: Users, label: 'Members' },
    { path: '/visitors', icon: UserPlus, label: 'Visitors' },
    { path: '/teachers', icon: GraduationCap, label: 'Teachers' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { path: '/finance', icon: Wallet, label: 'Finance' },
    { path: '/bulk-sms', icon: MessageSquare, label: 'Bulk SMS' },
    { path: '/equipment', icon: Package, label: 'Equipment' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/cluster-followup', icon: UsersRound, label: 'Cluster Follow-up' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-2xl
        `}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/church-logo.png"
                            alt="Mt. Olivet Methodist - Ahwiaa Society Children Ministry"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-[11px] font-semibold leading-tight text-white">Mt. Olivet Methodist</h2>
                            <p className="text-[10px] text-blue-200 leading-tight">Ahwiaa Society Children Ministry</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => {
                                        // Close sidebar on mobile when navigating
                                        if (window.innerWidth < 1024) {
                                            onClose();
                                        }
                                    }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                                            ? 'bg-white text-blue-900 shadow-lg'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-white border-opacity-20">
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white backdrop-blur-sm">
                        <p className="text-xs mb-1 font-medium">Church Management System</p>
                        <p className="text-xs text-blue-200">Version 1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
