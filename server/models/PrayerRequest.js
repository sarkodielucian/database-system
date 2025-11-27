const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrayerRequest = sequelize.define('PrayerRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requestType: {
        type: DataTypes.ENUM('Personal', 'Family', 'Health', 'Financial', 'Spiritual', 'Other'),
        defaultValue: 'Personal'
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Prayer', 'Answered', 'Closed'),
        defaultValue: 'Open'
    },
    privacy: {
        type: DataTypes.ENUM('Public', 'Private', 'Leaders Only'),
        defaultValue: 'Public'
    },
    prayerCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isUrgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    answeredDate: {
        type: DataTypes.DATE
    },
    testimony: {
        type: DataTypes.TEXT
    }
});

module.exports = PrayerRequest;
