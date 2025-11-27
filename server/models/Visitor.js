const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visitor = sequelize.define('Visitor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    visitDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    purpose: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('First Time', 'Returning', 'Converted'),
        defaultValue: 'First Time'
    },
    followUpStatus: {
        type: DataTypes.ENUM('Pending', 'Contacted', 'Scheduled'),
        defaultValue: 'Pending'
    },
    address: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    },
    referredBy: {
        type: DataTypes.STRING
    }
});

module.exports = Visitor;
