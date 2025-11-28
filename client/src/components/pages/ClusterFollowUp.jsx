import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { UsersRound, Plus, Search, Calendar, Phone, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function ClusterFollowUp() {
    const [activeTab, setActiveTab] = useState('clusters');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalClusters: 0,
        activeFollowUps: 0,
        completedFollowUps: 0,
        overdueFollowUps: 0
    });
    const [clusters, setClusters] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch(`${API_BASE_URL}/api/clusters/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch clusters
            const clustersRes = await fetch(`${API_BASE_URL}/api/clusters/clusters');
            const clustersData = await clustersRes.json();
            setClusters(clustersData);

            // Fetch follow-ups
            const followUpsRes = await fetch(`${API_BASE_URL}/api/clusters/followups');
            const followUpsData = await followUpsRes.json();
            setFollowUps(followUpsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching cluster data:', error);
            setLoading(false);
        }
    };

    const handleCompleteFollowUp = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/clusters/followups/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error completing follow-up:', error);
        }
    };

    const filteredClusters = clusters.filter(cluster =>
        cluster.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.leader?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFollowUps = followUps.filter(followUp =>
        followUp.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        followUp.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-gray-900">Cluster Follow-up</h1>
                    <p className="text-gray-600 mt-1">Manage clusters and member follow-ups</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    <span>Add Cluster</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Clusters</p>
                            <h3 className="text-gray-900 mt-2">{stats.totalClusters}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <UsersRound className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active Follow-ups</p>
                            <h3 className="text-gray-900 mt-2">{stats.activeFollowUps}</h3>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Completed</p>
                            <h3 className="text-gray-900 mt-2">{stats.completedFollowUps}</h3>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Overdue</p>
                            <h3 className="text-gray-900 mt-2">{stats.overdueFollowUps}</h3>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="border-b border-gray-200">
                    <div className="flex gap-4 px-6">
                        <button
                            onClick={() => setActiveTab('clusters')}
                            className={`py-4 px-2 border-b-2 transition-colors ${activeTab === 'clusters'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Clusters
                        </button>
                        <button
                            onClick={() => setActiveTab('followups')}
                            className={`py-4 px-2 border-b-2 transition-colors ${activeTab === 'followups'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Follow-ups
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={activeTab === 'clusters' ? 'Search clusters...' : 'Search follow-ups...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading...</div>
                    ) : activeTab === 'clusters' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cluster</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Leader</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Members</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Next Meeting</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClusters.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No clusters found</td>
                                        </tr>
                                    ) : (
                                        filteredClusters.map((cluster) => (
                                            <tr key={cluster.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white">
                                                            {cluster.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-gray-900">{cluster.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {cluster.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cluster.leader}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cluster.memberCount || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cluster.location || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {cluster.nextMeetingDate || 'Not scheduled'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${cluster.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {cluster.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                            <UsersRound className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Contact">
                                                            <Phone className="w-4 h-4 text-green-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cluster</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFollowUps.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No follow-ups found</td>
                                        </tr>
                                    ) : (
                                        filteredFollowUps.map((followup) => (
                                            <tr key={followup.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{followup.memberName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {followup.Cluster?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${followup.type === 'Absent' ? 'bg-red-100 text-red-800' :
                                                            followup.type === 'Visitor' ? 'bg-blue-100 text-blue-800' :
                                                                followup.type === 'New Member' ? 'bg-green-100 text-green-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {followup.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${followup.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                            followup.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                        }`}>
                                                        {followup.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{followup.assignedTo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{followup.dueDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${followup.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                            followup.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-green-100 text-green-800'
                                                        }`}>
                                                        {followup.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Contact">
                                                            <MessageSquare className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCompleteFollowUp(followup.id)}
                                                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Mark Complete"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
