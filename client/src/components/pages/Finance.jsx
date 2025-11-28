import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Finance() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    const [monthlyData, setMonthlyData] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            // Fetch summary
            const summaryRes = await fetch(`${API_BASE_URL}/api/finance/summary');
            const summaryData = await summaryRes.json();
            setSummary(summaryData);

            // Fetch monthly data
            const monthlyRes = await fetch(`${API_BASE_URL}/api/finance/monthly-data');
            const monthlyDataRes = await monthlyRes.json();
            setMonthlyData(monthlyDataRes);

            // Fetch expense categories
            const categoriesRes = await fetch(`${API_BASE_URL}/api/finance/expense-categories');
            const categoriesData = await categoriesRes.json();
            setExpenseCategories(categoriesData);

            // Fetch recent transactions
            const transactionsRes = await fetch(`${API_BASE_URL}/api/finance/transactions?limit=10');
            const transactionsData = await transactionsRes.json();
            setTransactions(transactionsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching financial data:', error);
            setLoading(false);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [transactionType, setTransactionType] = useState('income');
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        donorName: '',
        status: 'Pending'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = transactionType === 'income'
                ? `${API_BASE_URL}/api/finance/donations'
                : `${API_BASE_URL}/api/finance/expenses';

            const payload = {
                ...formData,
                type: transactionType === 'income' ? 'Donation' : undefined // Default type for donation
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowModal(false);
                fetchFinancialData();
                setFormData({
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                    paymentMethod: 'Cash',
                    donorName: '',
                    status: 'Pending'
                });
            } else {
                alert('Failed to save transaction');
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Error saving transaction');
        }
    };

    const totalIncome = summary.totalIncome || 0;
    const totalExpenses = summary.totalExpenses || 0;
    const balance = summary.balance || 0;

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-gray-900">Financial Management</h1>
                    <p className="text-gray-600 mt-1">Track income, expenses, and pledges</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Income</p>
                            <h3 className="text-gray-900 mt-2">GHS {totalIncome.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">+12.5%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                            <ArrowUpCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Expenses</p>
                            <h3 className="text-gray-900 mt-2">GHS {totalExpenses.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingDown className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-500">+5.2%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            <ArrowDownCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Net Balance</p>
                            <h3 className="text-gray-900 mt-2">GHS {balance.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-500">Healthy</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="border-b border-gray-200">
                    <div className="flex gap-4 px-6">
                        {['overview', 'income', 'expenses', 'pledges'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading financial data...</div>
                    ) : activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Income vs Expenses Chart */}
                            <div>
                                <h4 className="text-gray-900 mb-4">Income vs Expenses</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="income" fill="#10b981" name="Income (GHS)" />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses (GHS)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Expense Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-gray-900 mb-4">Expense Breakdown</h4>
                                    {expenseCategories.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={expenseCategories}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {expenseCategories.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">No expense data available</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-gray-900 mb-4">Category Details</h4>
                                    <div className="space-y-3">
                                        {expenseCategories.map((category, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                                                    <span className="text-gray-700">{category.name}</span>
                                                </div>
                                                <span className="text-gray-900">GHS {category.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'income' && (
                        <div>
                            <h4 className="text-gray-900 mb-4">Income Records</h4>
                            <p className="text-gray-600">Income tracking and donation management interface</p>
                        </div>
                    )}

                    {activeTab === 'expenses' && (
                        <div>
                            <h4 className="text-gray-900 mb-4">Expense Records</h4>
                            <p className="text-gray-600">Expense tracking and budget management interface</p>
                        </div>
                    )}

                    {activeTab === 'pledges' && (
                        <div>
                            <h4 className="text-gray-900 mb-4">Pledge Management</h4>
                            <p className="text-gray-600">Track pledges and commitments</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">Recent Transactions</h4>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{transaction.date}</td>
                                        <td className="px-6 py-4 text-gray-900">{transaction.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{transaction.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}GHS {transaction.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                {transaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setTransactionType('income')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${transactionType === 'income'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Income
                            </button>
                            <button
                                onClick={() => setTransactionType('expense')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${transactionType === 'expense'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Expense
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GHS)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {transactionType === 'income' ? (
                                        <>
                                            <option value="Offering">Offering</option>
                                            <option value="Tithe">Tithe</option>
                                            <option value="Donation">Donation</option>
                                            <option value="Pledge Payment">Pledge Payment</option>
                                            <option value="Other">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Ministry">Ministry</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Events">Events</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Salaries">Salaries</option>
                                            <option value="Equipment">Equipment</option>
                                            <option value="Other">Other</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description/Notes</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            {transactionType === 'income' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name (Optional)</label>
                                    <input
                                        type="text"
                                        name="donorName"
                                        value={formData.donorName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
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
                                    className={`px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all ${transactionType === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Save {transactionType === 'income' ? 'Income' : 'Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
