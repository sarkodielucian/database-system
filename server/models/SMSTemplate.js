const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SMSTemplate = sequelize.define('SMSTemplate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Service', 'Event', 'Birthday', 'General', 'Emergency'),
        defaultValue: 'General'
    },
    usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = SMSTemplate;
