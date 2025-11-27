import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserPlus, GraduationCap,
    CalendarCheck, DollarSign, MessageSquare,
    Monitor, FileText, Settings, Network
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export const Layout = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[1] || 'dashboard';

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/members', icon: Users, label: 'Members' },
        { to: '/visitors', icon: UserPlus, label: 'Visitors' },
        { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
        { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
        { to: '/finance', icon: DollarSign, label: 'Finance' },
        { to: '/bulk-sms', icon: MessageSquare, label: 'Bulk SMS' },
        { to: '/equipment', icon: Monitor, label: 'Equipment' },
        { to: '/reports', icon: FileText, label: 'Reports' },
        { to: '/cluster-followup', icon: Network, label: 'Cluster Follow-up' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-blue-700 leading-tight">
                        Mt. Olivet
                        <span className="block text-sm font-normal text-slate-500">Children Ministry</span>
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            active={location.pathname.startsWith(item.to)}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Admin User</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-slate-800 capitalize">
                        {path.replace('-', ' ')}
                    </h2>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
