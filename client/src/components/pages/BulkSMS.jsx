import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { MessageSquare, Send, Users, Calendar, CheckCircle, Clock } from 'lucide-react';

export function BulkSMS() {
    const [message, setMessage] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [stats, setStats] = useState({ totalSent: 0, thisMonth: 0, scheduled: 0 });
    const [recentMessages, setRecentMessages] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const groups = ['All Members', 'Beginners', 'Middle', 'Senior', 'Teachers', 'Parents'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch(`${API_BASE_URL}/api/sms/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch recent messages
            const messagesRes = await fetch(`${API_BASE_URL}/api/sms/messages');
            const messagesData = await messagesRes.json();
            setRecentMessages(messagesData.slice(0, 5));

            // Fetch templates
            const templatesRes = await fetch(`${API_BASE_URL}/api/sms/templates');
            const templatesData = await templatesRes.json();
            setTemplates(templatesData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching SMS data:', error);
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || selectedGroups.length === 0) {
            alert('Please enter a message and select at least one group');
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/api/sms/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    selectedGroups,
                    recipientType: 'Custom'
                })
            });

            alert('Message sent successfully!');
            setMessage('');
            setSelectedGroups([]);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-gray-900">Bulk SMS</h1>
                <p className="text-gray-600 mt-1">Send messages to members and groups</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Messages Sent</p>
                            <h3 className="text-gray-900 mt-2">{stats.totalSent.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <Send className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">This Month</p>
                            <h3 className="text-gray-900 mt-2">{stats.thisMonth}</h3>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Scheduled</p>
                            <h3 className="text-gray-900 mt-2">{stats.scheduled}</h3>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Compose & Templates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-6">
                    <h4 className="text-gray-900 mb-4">Compose Message</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Select Recipients</label>
                            <div className="grid grid-cols-2 gap-2">
                                {groups.map((group) => (
                                    <button
                                        key={group}
                                        onClick={() => {
                                            setSelectedGroups(prev =>
                                                prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
                                            );
                                        }}
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedGroups.includes(group)
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">{message.length} / 160 characters</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSendMessage}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 gradient-blue text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                <Send className="w-4 h-4" />
                                <span>Send Now</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Calendar className="w-4 h-4" />
                                <span>Schedule</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h4 className="text-gray-900 mb-4">Templates</h4>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-gray-500 text-sm">Loading templates...</p>
                        ) : templates.length > 0 ? (
                            templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setMessage(template.content)}
                                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                                >
                                    <p className="text-sm text-gray-900">{template.name}</p>
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No templates available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Messages */}
            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">Recent Messages</h4>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-gray-500">Loading messages...</p>
                    ) : recentMessages.length > 0 ? (
                        recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-gray-900">{msg.message.substring(0, 50)}...</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(msg.createdAt).toLocaleDateString()} • {msg.recipientCount} recipients
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs ${msg.status === 'Sent' ? 'bg-green-100 text-green-800' :
                                        msg.status === 'Scheduled' ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                    }`}>
                                    {msg.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No messages yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
