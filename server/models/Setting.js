const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    value: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.ENUM('general', 'notifications', 'security', 'system'),
        defaultValue: 'general'
    },
    description: {
        type: DataTypes.TEXT
    }
});

module.exports = Setting;
