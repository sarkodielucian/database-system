const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Birthday', 'Anniversary', 'Milestone', 'Event', 'System', 'FollowUp'),
        defaultValue: 'System'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    relatedId: {
        type: DataTypes.INTEGER // ID of related entity (Member, Event, etc.)
    }
});

module.exports = Notification;
