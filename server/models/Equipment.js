const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipment = sequelize.define('Equipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Audio/Visual', 'Furniture', 'Teaching Materials', 'Office Equipment', 'Other'),
        defaultValue: 'Other'
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    condition: {
        type: DataTypes.ENUM('Good', 'Fair', 'Needs Repair'),
        defaultValue: 'Good'
    },
    location: {
        type: DataTypes.STRING
    },
    assignedTo: {
        type: DataTypes.STRING
    },
    lastMaintenanceDate: {
        type: DataTypes.DATEONLY
    },
    nextMaintenanceDate: {
        type: DataTypes.DATEONLY
    },
    purchaseDate: {
        type: DataTypes.DATEONLY
    },
    purchasePrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Equipment;
