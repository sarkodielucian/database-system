import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { Package, Plus, Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function Equipment() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [stats, setStats] = useState({
        totalItems: 0,
        goodCondition: 0,
        fairCondition: 0,
        needsRepair: 0
    });
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [categoryFilter]);

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch(`${API_BASE_URL}/api/equipment/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch equipment
            const equipmentRes = await fetch(
                `${API_BASE_URL}/api/equipment${categoryFilter !== 'All Categories' ? `?category=${categoryFilter}` : ''}`
            );
            const equipmentData = await equipmentRes.json();
            setEquipment(equipmentData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching equipment data:', error);
            setLoading(false);
        }
    };

    const filteredEquipment = equipment.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Audio/Visual',
        quantity: 1,
        condition: 'Good',
        location: '',
        assignedTo: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        cost: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/equipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                fetchData();
                setFormData({
                    name: '',
                    category: 'Audio/Visual',
                    quantity: 1,
                    condition: 'Good',
                    location: '',
                    assignedTo: '',
                    purchaseDate: new Date().toISOString().split('T')[0],
                    cost: '',
                    notes: ''
                });
            } else {
                alert('Failed to add equipment');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            alert('Error adding equipment');
        }
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-gray-900">Equipment Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage church equipment and assets</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Equipment</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Items</p>
                            <h3 className="text-gray-900 mt-2">{stats.totalItems}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Good Condition</p>
                            <h3 className="text-gray-900 mt-2">{stats.goodCondition}</h3>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Needs Attention</p>
                            <h3 className="text-gray-900 mt-2">{stats.fairCondition}</h3>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Needs Repair</p>
                            <h3 className="text-gray-900 mt-2">{stats.needsRepair}</h3>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>All Categories</option>
                            <option>Audio/Visual</option>
                            <option>Furniture</option>
                            <option>Teaching Materials</option>
                            <option>Office Equipment</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Equipment Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Condition</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Last Maintenance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredEquipment.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No equipment found</td>
                                </tr>
                            ) : (
                                filteredEquipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs ${item.condition === 'Good' ? 'bg-green-100 text-green-800' :
                                                item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.location || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.assignedTo || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {item.lastMaintenanceDate || 'Never'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Equipment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Equipment</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option>Audio/Visual</option>
                                        <option>Furniture</option>
                                        <option>Teaching Materials</option>
                                        <option>Office Equipment</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option>Good</option>
                                        <option>Fair</option>
                                        <option>Needs Repair</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost (GHS)</label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                <input
                                    type="text"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Equipment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
