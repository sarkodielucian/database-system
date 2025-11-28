import React, { useEffect, useState } from 'react';
import {
    Users, GraduationCap, UserPlus, UserCheck,
    TrendingUp, DollarSign, Calendar, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { API_BASE_URL } from '../config';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalTeachers: 0,
        totalVisitors: 0,
        totalDonations: 0,
        classDistribution: [
            { name: 'Beginners', value: 0, color: '#3b82f6' },
            { name: 'Middle', value: 0, color: '#8b5cf6' },
            { name: 'Senior', value: 0, color: '#10b981' },
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
                const data = await response.json();
                setStats(prev => ({
                    ...prev,
                    ...data
                }));
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Mock data for charts (to be replaced with real API data later)
    const attendanceData = [
        { month: 'Jan', attendance: 280, target: 300 },
        { month: 'Feb', attendance: 290, target: 300 },
        { month: 'Mar', attendance: 275, target: 300 },
        { month: 'Apr', attendance: 295, target: 320 },
        { month: 'May', attendance: 310, target: 320 },
        { month: 'Jun', attendance: 305, target: 320 },
    ];

    const financeData = [
        { month: 'Jan', income: 4500, expenses: 3200 },
        { month: 'Feb', income: 5200, expenses: 3800 },
        { month: 'Mar', income: 4800, expenses: 3500 },
        { month: 'Apr', income: 5500, expenses: 4000 },
        { month: 'May', income: 6200, expenses: 4200 },
        { month: 'Jun', income: 5800, expenses: 3900 },
    ];

    const classDistribution = stats.classDistribution;

    const recentActivities = [
        { id: 1, type: 'member', message: 'New member: John Mensah joined', time: '2 hours ago', icon: Users },
        { id: 2, type: 'attendance', message: 'Sunday service attendance recorded', time: '5 hours ago', icon: UserCheck },
        { id: 3, type: 'finance', message: 'Monthly offering received: GHS 5,800', time: '1 day ago', icon: DollarSign },
        { id: 4, type: 'visitor', message: '3 new visitors registered', time: '2 days ago', icon: UserPlus },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Sunday School', date: 'This Sunday', time: '8:00 AM' },
        { id: 2, title: 'Teachers Meeting', date: 'Wednesday', time: '6:00 PM' },
        { id: 3, title: 'Monthly Report Due', date: 'June 30', time: 'End of Day' },
    ];

    const statsCards = [
        {
            title: 'Total Members',
            value: stats.totalMembers,
            change: '+12%',
            trend: 'up',
            icon: Users,
            gradient: 'from-blue-500 to-blue-700'
        },
        {
            title: 'Teachers',
            value: stats.totalTeachers,
            change: '+5%',
            trend: 'up',
            icon: GraduationCap,
            gradient: 'from-purple-500 to-purple-700'
        },
        {
            title: 'Visitors (Total)',
            value: stats.totalVisitors,
            change: '+18%',
            trend: 'up',
            icon: UserPlus,
            gradient: 'from-green-500 to-green-700'
        },
        {
            title: 'Total Donations',
            value: `GHS ${(stats.totalDonations || 0).toLocaleString()}`,
            change: '+3%',
            trend: 'up',
            icon: DollarSign, // Changed from UserCheck to DollarSign for donations
            gradient: 'from-orange-500 to-orange-700'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-in pb-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Mt. Olivet Children Ministry Management System</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                                    <span className="text-xs text-gray-400 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trends */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Attendance Trends</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Actual Attendance" />
                                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Financial Overview</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income (GHS)" />
                                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses (GHS)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Second Row of Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Class Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Class Distribution</h4>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={classDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {classDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        {classDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h4>
                    <div className="space-y-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                    <activity.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Upcoming Events</h4>
                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{event.date}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <p className="text-xs text-gray-500">{event.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Add Member</span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Take Attendance</span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Record Offering</span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Send Alert</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
