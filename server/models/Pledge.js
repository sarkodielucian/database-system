const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pledge = sequelize.define('Pledge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pledgeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    campaignName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM('One-time', 'Weekly', 'Monthly', 'Quarterly'),
        defaultValue: 'Monthly'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Fulfilled', 'Cancelled', 'Overdue'),
        defaultValue: 'Active'
    },
    reminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastReminderDate: {
        type: DataTypes.DATE
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Pledge;
