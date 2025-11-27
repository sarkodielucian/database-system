const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Offering', 'Tithe', 'Donation', 'Pledge Payment', 'Online', 'Other'),
        defaultValue: 'Offering'
    },
    paymentMethod: {
        type: DataTypes.ENUM('Cash', 'Mobile Money', 'Bank Transfer', 'Card', 'Check'),
        defaultValue: 'Cash'
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    campaignId: {
        type: DataTypes.INTEGER // Links to specific campaigns
    },
    donorName: {
        type: DataTypes.STRING
    },
    donorEmail: {
        type: DataTypes.STRING
    },
    donorPhone: {
        type: DataTypes.STRING
    },
    isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    recurringFrequency: {
        type: DataTypes.ENUM('Weekly', 'Monthly', 'Quarterly', 'Annually'),
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('Completed', 'Pending', 'Failed'),
        defaultValue: 'Completed'
    },
    receiptNumber: {
        type: DataTypes.STRING
    },
    giftAidEligible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Donation;
