import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Plus, Download, Upload, MoreVertical,
    Edit, Trash2, Eye, Mail, Phone, MapPin, User, Camera, Calendar
} from 'lucide-react';

export const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [editingVisitor, setEditingVisitor] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        visitDate: new Date().toISOString().split('T')[0],
        purpose: '',
        status: 'First Time',
        followUpStatus: 'Pending',
        notes: '',
        photo: ''
    });

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/visitors');
            const data = await response.json();
            setVisitors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching visitors:', error);
            setVisitors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                alert('Photo size must be less than 1MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            visitDate: new Date().toISOString().split('T')[0],
            purpose: '',
            status: 'First Time',
            followUpStatus: 'Pending',
            notes: '',
            photo: ''
        });
        setPhotoPreview(null);
        setEditingVisitor(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingVisitor
                ? `http://localhost:5000/api/visitors/${editingVisitor.id}`
                : 'http://localhost:5000/api/visitors';

            const method = editingVisitor ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowAddModal(false);
                resetForm();
                fetchVisitors();
                alert(editingVisitor ? 'Visitor updated successfully!' : 'Visitor added successfully!');
            } else {
                alert('Failed to save visitor');
            }
        } catch (error) {
            console.error('Error saving visitor:', error);
            alert('Error saving visitor. Please try again.');
        }
    };

    const handleEdit = (visitor) => {
        setEditingVisitor(visitor);
        setFormData({
            name: visitor.name || '',
            phone: visitor.phone || '',
            email: visitor.email || '',
            visitDate: visitor.visitDate || new Date().toISOString().split('T')[0],
            purpose: visitor.purpose || '',
            status: visitor.status || 'First Time',
            followUpStatus: visitor.followUpStatus || 'Pending',
            notes: visitor.notes || '',
            photo: visitor.photo || ''
        });
        setPhotoPreview(visitor.photo || null);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this visitor?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/visitors/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchVisitors();
                alert('Visitor deleted successfully!');
            } else {
                alert('Failed to delete visitor');
            }
        } catch (error) {
            console.error('Error deleting visitor:', error);
            alert('Error deleting visitor');
        }
    };

    const filteredVisitors = visitors.filter(visitor => {
        const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (visitor.email && visitor.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || visitor.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visitors Management</h1>
                    <p className="text-gray-600 mt-1">Track and follow up with church visitors</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                        <Upload className="w-4 h-4" />
                        <span>Import</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Visitor</span>
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card p-6 bg-white">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="First Time">First Time</option>
                            <option value="Returning">Returning</option>
                            <option value="Converted">Converted</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Visitors Table */}
            <div className="card overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visit Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow Up</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading visitors...</td></tr>
                            ) : filteredVisitors.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No visitors found</td></tr>
                            ) : (
                                filteredVisitors.map((visitor) => (
                                    <tr key={visitor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {visitor.photo ? (
                                                    <img
                                                        src={visitor.photo}
                                                        alt={visitor.name}
                                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 font-bold">
                                                        {visitor.name[0]}
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {visitor.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {visitor.visitDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {visitor.phone || '-'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3 h-3" />
                                                    {visitor.email || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${visitor.status === 'First Time' ? 'bg-blue-100 text-blue-800' :
                                                    visitor.status === 'Returning' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {visitor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${visitor.followUpStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    visitor.followUpStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {visitor.followUpStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedVisitor(visitor)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(visitor)}
                                                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-green-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(visitor.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visitor Detail Modal */}
            {selectedVisitor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="bg-blue-600 p-6 text-white rounded-t-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {selectedVisitor.photo ? (
                                        <img
                                            src={selectedVisitor.photo}
                                            alt={selectedVisitor.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                            {selectedVisitor.name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedVisitor.name}</h3>
                                        <p className="text-blue-100 text-sm">Visitor ID: {selectedVisitor.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedVisitor(null)}
                                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Visit Date</p>
                                    <p className="text-gray-900 mt-1 font-medium">{selectedVisitor.visitDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="text-gray-900 mt-1 font-medium">{selectedVisitor.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900 mt-1">{selectedVisitor.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900 mt-1">{selectedVisitor.email || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Purpose</p>
                                    <p className="text-gray-900 mt-1">{selectedVisitor.purpose || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="text-gray-900 mt-1">{selectedVisitor.notes || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Follow Up Status</p>
                                    <p className="text-gray-900 mt-1">{selectedVisitor.followUpStatus}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setSelectedVisitor(null);
                                        handleEdit(selectedVisitor);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setSelectedVisitor(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Visitor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingVisitor ? 'Edit Visitor' : 'Add New Visitor'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </label>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Click camera icon to upload photo (max 1MB)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                                    <input
                                        type="date"
                                        name="visitDate"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.visitDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="First Time">First Time</option>
                                        <option value="Returning">Returning</option>
                                        <option value="Converted">Converted</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow Up Status</label>
                                    <select
                                        name="followUpStatus"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.followUpStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        name="notes"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingVisitor ? 'Update Visitor' : 'Save Visitor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
