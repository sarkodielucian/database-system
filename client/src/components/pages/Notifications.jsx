import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { Bell, Check, Info, Calendar, Heart, Award } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications');
            const data = await response.json();
            setNotifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PUT'
            });
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const runChecks = async () => {
        try {
            setLoading(true);
            await fetch(`${API_BASE_URL}/api/notifications/check', {
                method: 'POST'
            });
            await fetchNotifications();
        } catch (error) {
            console.error('Error running checks:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'Birthday': return <Calendar className="w-5 h-5 text-pink-500" />;
            case 'Anniversary': return <Heart className="w-5 h-5 text-red-500" />;
            case 'Milestone': return <Award className="w-5 h-5 text-yellow-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="p-6 space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500">Stay updated with important alerts and reminders</p>
                </div>
                <button
                    onClick={runChecks}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Bell className="w-4 h-4" />
                    Check for Updates
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(notification.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
