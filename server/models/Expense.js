const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Ministry', 'Utilities', 'Events', 'Maintenance', 'Salaries', 'Equipment', 'Other'),
        defaultValue: 'Other'
    },
    department: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    paymentMethod: {
        type: DataTypes.ENUM('Cash', 'Mobile Money', 'Bank Transfer', 'Card', 'Check'),
        defaultValue: 'Cash'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Paid'),
        defaultValue: 'Pending'
    },
    approvedBy: {
        type: DataTypes.STRING
    },
    approvalDate: {
        type: DataTypes.DATE
    },
    receiptUrl: {
        type: DataTypes.STRING // Path to uploaded receipt
    },
    budgetYear: {
        type: DataTypes.INTEGER,
        defaultValue: new Date().getFullYear()
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Expense;
