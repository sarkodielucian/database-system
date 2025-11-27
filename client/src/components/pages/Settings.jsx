import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Church, Users, Bell, Lock, Database, Globe } from 'lucide-react';

export function Settings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [autoBackups, setAutoBackups] = useState(true);
    const [churchInfo, setChurchInfo] = useState({
        name: 'Mt. Olivet Children Ministry',
        location: 'Ahwiaa, Kumasi'
    });
    const [showChurchModal, setShowChurchModal] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/settings');
            const data = await response.json();

            if (data.emailNotifications !== undefined) setEmailNotifications(data.emailNotifications === 'true');
            if (data.smsNotifications !== undefined) setSmsNotifications(data.smsNotifications === 'true');
            if (data.autoBackups !== undefined) setAutoBackups(data.autoBackups === 'true');
            if (data.churchName) setChurchInfo(prev => ({ ...prev, name: data.churchName }));
            if (data.churchLocation) setChurchInfo(prev => ({ ...prev, location: data.churchLocation }));
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const settingsCategories = [
        {
            title: 'General Settings',
            icon: SettingsIcon,
            color: 'from-blue-500 to-blue-700',
            items: ['Church Information', 'Contact Details', 'Logo & Branding']
        },
        {
            title: 'User Management',
            icon: Users,
            color: 'from-purple-500 to-purple-700',
            items: ['User Roles', 'Permissions', 'Access Control']
        },
        {
            title: 'Notifications',
            icon: Bell,
            color: 'from-green-500 to-green-700',
            items: ['Email Settings', 'SMS Settings', 'Push Notifications']
        },
        {
            title: 'Security',
            icon: Lock,
            color: 'from-red-500 to-red-700',
            items: ['Password Policy', 'Two-Factor Auth', 'Session Management']
        },
        {
            title: 'Data Management',
            icon: Database,
            color: 'from-orange-500 to-orange-700',
            items: ['Backup & Restore', 'Data Export', 'Archive Settings']
        },
        {
            title: 'System Settings',
            icon: Globe,
            color: 'from-teal-500 to-teal-700',
            items: ['Language', 'Time Zone', 'Currency']
        },
    ];

    const handleSaveSettings = async (setting, value) => {
        try {
            await fetch('http://localhost:5000/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: setting, value: String(value) })
            });
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    };

    const handleUpdateChurchInfo = async (e) => {
        e.preventDefault();
        await handleSaveSettings('churchName', churchInfo.name);
        await handleSaveSettings('churchLocation', churchInfo.location);
        setShowChurchModal(false);
    };

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage system settings and configurations</p>
            </div>

            {/* Church Info Card */}
            <div className="card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-xl gradient-blue flex items-center justify-center">
                        <Church className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h3 className="text-gray-900">{churchInfo.name}</h3>
                        <p className="text-gray-600">{churchInfo.location}</p>
                        <button
                            onClick={() => setShowChurchModal(true)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                            Update Church Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <div key={index} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h5 className="text-gray-900 mb-3">{category.title}</h5>
                            <ul className="space-y-2">
                                {category.items.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Quick Settings */}
            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">Quick Settings</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive email alerts for important events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={emailNotifications}
                                onChange={(e) => {
                                    setEmailNotifications(e.target.checked);
                                    handleSaveSettings('emailNotifications', e.target.checked);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Send SMS alerts to members</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={smsNotifications}
                                onChange={(e) => {
                                    setSmsNotifications(e.target.checked);
                                    handleSaveSettings('smsNotifications', e.target.checked);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-gray-900">Automatic Backups</p>
                            <p className="text-sm text-gray-600">Daily automated data backups</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={autoBackups}
                                onChange={(e) => {
                                    setAutoBackups(e.target.checked);
                                    handleSaveSettings('autoBackups', e.target.checked);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* System Information */}
            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">System Version</p>
                        <p className="text-gray-900 font-medium mt-1">1.0.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Database Status</p>
                        <p className="text-green-600 font-medium mt-1">● Connected</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Last Backup</p>
                        <p className="text-gray-900 font-medium mt-1">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Members</p>
                        <p className="text-gray-900 font-medium mt-1">324</p>
                    </div>
                </div>
            </div>

            {/* Update Church Info Modal */}
            {showChurchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Church Information</h2>
                        <form onSubmit={handleUpdateChurchInfo} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
                                <input
                                    type="text"
                                    value={churchInfo.name}
                                    onChange={(e) => setChurchInfo(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={churchInfo.location}
                                    onChange={(e) => setChurchInfo(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowChurchModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
