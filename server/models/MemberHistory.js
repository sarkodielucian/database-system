const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberHistory = sequelize.define('MemberHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action: {
        type: DataTypes.STRING, // e.g., 'Status Change', 'Renewal', 'Class Update'
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    performedBy: {
        type: DataTypes.STRING // Could be User ID or Name
    }
});

module.exports = MemberHistory;
