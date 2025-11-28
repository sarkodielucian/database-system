import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import {
    Search, Filter, Plus, Download, Upload, MoreVertical,
    Edit, Trash2, Eye, Mail, Phone, MapPin, User, Camera, Award
} from 'lucide-react';

const roleColors = {
    'Super': 'bg-purple-100 text-purple-800',
    'HoD': 'bg-blue-100 text-blue-800',
    'Teacher': 'bg-green-100 text-green-800',
    'Helper': 'bg-orange-100 text-orange-800',
};

export const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: 'Teacher',
        class: 'All Classes',
        phone: '',
        email: '',
        address: '',
        maritalStatus: 'Single',
        employmentStatus: 'Volunteer',
        status: 'Active',
        joinDate: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        photo: ''
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers');
            const data = await response.json();
            setTeachers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeachers([]);
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
            firstName: '',
            lastName: '',
            role: 'Teacher',
            class: 'All Classes',
            phone: '',
            email: '',
            address: '',
            maritalStatus: 'Single',
            employmentStatus: 'Volunteer',
            status: 'Active',
            joinDate: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            photo: ''
        });
        setPhotoPreview(null);
        setEditingTeacher(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingTeacher
                ? `${API_BASE_URL}/api/teachers/${editingTeacher.id}`
                : `${API_BASE_URL}/api/teachers';

            const method = editingTeacher ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowAddModal(false);
                resetForm();
                fetchTeachers();
                alert(editingTeacher ? 'Teacher updated successfully!' : 'Teacher added successfully!');
            } else {
                alert('Failed to save teacher');
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Error saving teacher. Please try again.');
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            role: teacher.role || 'Teacher',
            class: teacher.class || 'All Classes',
            phone: teacher.phone || '',
            email: teacher.email || '',
            address: teacher.address || '',
            maritalStatus: teacher.maritalStatus || 'Single',
            employmentStatus: teacher.employmentStatus || 'Volunteer',
            status: teacher.status || 'Active',
            joinDate: teacher.joinDate || '',
            emergencyContactName: teacher.emergencyContactName || '',
            emergencyContactPhone: teacher.emergencyContactPhone || '',
            photo: teacher.photo || ''
        });
        setPhotoPreview(teacher.photo || null);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this teacher?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchTeachers();
                alert('Teacher deleted successfully!');
            } else {
                alert('Failed to delete teacher');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Error deleting teacher');
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterRole === 'all' || teacher.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
                    <p className="text-gray-600 mt-1">Manage Sunday school teachers and staff</p>
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
                        <span>Add Teacher</span>
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
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="Super">Super</option>
                            <option value="HoD">HoD</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Helper">Helper</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Teachers Table */}
            <div className="card overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading teachers...</td></tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No teachers found</td></tr>
                            ) : (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {teacher.photo ? (
                                                    <img
                                                        src={teacher.photo}
                                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 font-bold">
                                                        {teacher.firstName[0]}{teacher.lastName[0]}
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</div>
                                                    <div className="text-xs text-gray-500">ID: {teacher.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[teacher.role] || 'bg-gray-100 text-gray-800'}`}>
                                                {teacher.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {teacher.class}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {teacher.phone || '-'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3 h-3" />
                                                    {teacher.email || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedTeacher(teacher)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(teacher)}
                                                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-green-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
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

            {/* Teacher Detail Modal */}
            {selectedTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="bg-blue-600 p-6 text-white rounded-t-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {selectedTeacher.photo ? (
                                        <img
                                            src={selectedTeacher.photo}
                                            alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                            {selectedTeacher.firstName[0]}{selectedTeacher.lastName[0]}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3>
                                        <p className="text-blue-100 text-sm">Teacher ID: {selectedTeacher.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-gray-900 mt-1 font-medium">{selectedTeacher.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Class</p>
                                    <p className="text-gray-900 mt-1 font-medium">{selectedTeacher.class}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="text-gray-900 mt-1 font-medium">{selectedTeacher.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Employment</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.employmentStatus}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.email || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.address || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Join Date</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.joinDate || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Marital Status</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.maritalStatus || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Emergency Contact</p>
                                    <p className="text-gray-900 mt-1">{selectedTeacher.emergencyContactName} ({selectedTeacher.emergencyContactPhone})</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setSelectedTeacher(null);
                                        handleEdit(selectedTeacher);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Teacher Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        name="role"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Super">Super</option>
                                        <option value="HoD">HoD</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Helper">Helper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        name="class"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                    >
                                        <option value="All Classes">All Classes</option>
                                        <option value="Beginners">Beginners</option>
                                        <option value="Middle">Middle</option>
                                        <option value="Senior">Senior</option>
                                    </select>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                                    <select
                                        name="employmentStatus"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.employmentStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Volunteer">Volunteer</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Full-time">Full-time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                    <select
                                        name="maritalStatus"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.maritalStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        name="emergencyContactName"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.emergencyContactName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                                    <input
                                        type="text"
                                        name="emergencyContactPhone"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.emergencyContactPhone}
                                        onChange={handleInputChange}
                                    />
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
                                    {editingTeacher ? 'Update Teacher' : 'Save Teacher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
