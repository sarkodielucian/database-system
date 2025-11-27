const { Donation, Pledge, Expense, Member } = require('../models');
const { Op } = require('sequelize');

// Get financial summary
exports.getSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const totalIncome = await Donation.sum('amount', { where: whereClause }) || 0;
        const totalExpenses = await Expense.sum('amount', {
            where: { ...whereClause, status: 'Paid' }
        }) || 0;
        const balance = totalIncome - totalExpenses;

        const activePledges = await Pledge.count({ where: { status: 'Active' } });
        const totalPledgeAmount = await Pledge.sum('pledgeAmount', { where: { status: 'Active' } }) || 0;

        res.json({
            totalIncome,
            totalExpenses,
            balance,
            activePledges,
            totalPledgeAmount
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get monthly data for charts
exports.getMonthlyData = async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year || new Date().getFullYear();

        const monthlyData = [];

        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(targetYear, month - 1, 1);
            const endDate = new Date(targetYear, month, 0);

            const income = await Donation.sum('amount', {
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }) || 0;

            const expenses = await Expense.sum('amount', {
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    },
                    status: 'Paid'
                }
            }) || 0;

            monthlyData.push({
                month: new Date(targetYear, month - 1).toLocaleString('default', { month: 'short' }),
                income: parseFloat(income),
                expenses: parseFloat(expenses)
            });
        }

        res.json(monthlyData);
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get expense categories breakdown
exports.getExpenseCategories = async (req, res) => {
    try {
        const categories = await Expense.findAll({
            attributes: [
                'category',
                [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'value']
            ],
            where: { status: 'Paid' },
            group: ['category']
        });

        const colors = {
            'Ministry': '#3b82f6',
            'Utilities': '#8b5cf6',
            'Events': '#10b981',
            'Maintenance': '#f59e0b',
            'Salaries': '#ef4444',
            'Equipment': '#06b6d4',
            'Other': '#6b7280'
        };

        const formattedData = categories.map(cat => ({
            name: cat.category,
            value: parseFloat(cat.dataValues.value),
            color: colors[cat.category] || '#6b7280'
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching expense categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const donations = await Donation.findAll({
            limit: parseInt(limit) / 2,
            order: [['date', 'DESC']],
            attributes: ['id', 'amount', 'type', 'category', 'date', 'notes', 'status']
        });

        const expenses = await Expense.findAll({
            limit: parseInt(limit) / 2,
            order: [['date', 'DESC']],
            attributes: ['id', 'amount', 'category', 'description', 'date', 'status']
        });

        const transactions = [
            ...donations.map(d => ({
                id: `D${d.id}`,
                type: 'income',
                category: d.category,
                amount: parseFloat(d.amount),
                date: d.date,
                description: d.notes || d.type,
                status: d.status
            })),
            ...expenses.map(e => ({
                id: `E${e.id}`,
                type: 'expense',
                category: e.category,
                amount: parseFloat(e.amount),
                date: e.date,
                description: e.description,
                status: e.status === 'Paid' ? 'Completed' : e.status
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions.slice(0, parseInt(limit)));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.json([]);  // Return empty array
    }
};

// Donation CRUD
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            include: [{ model: Member, attributes: ['firstName', 'lastName'] }],
            order: [['date', 'DESC']]
        });
        res.json(donations || []);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.json([]);
    }
};

exports.createDonation = async (req, res) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json(donation);
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Pledge CRUD
exports.getAllPledges = async (req, res) => {
    try {
        const pledges = await Pledge.findAll({
            include: [{ model: Member, attributes: ['firstName', 'lastName'] }],
            order: [['startDate', 'DESC']]
        });
        res.json(pledges || []);
    } catch (error) {
        console.error('Error fetching pledges:', error);
        res.json([]);
    }
};

exports.createPledge = async (req, res) => {
    try {
        const pledge = await Pledge.create(req.body);
        res.status(201).json(pledge);
    } catch (error) {
        console.error('Error creating pledge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Expense CRUD
exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            order: [['date', 'DESC']]
        });
        res.json(expenses || []);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.json([]);
    }
};

exports.createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
