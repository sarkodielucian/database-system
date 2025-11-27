const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SMSMessage = sequelize.define('SMSMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    recipientType: {
        type: DataTypes.ENUM('All Members', 'Beginners', 'Middle', 'Senior', 'Teachers', 'Parents', 'Custom'),
        defaultValue: 'All Members'
    },
    recipientCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Scheduled', 'Sending', 'Sent', 'Failed'),
        defaultValue: 'Draft'
    },
    scheduledDate: {
        type: DataTypes.DATE
    },
    sentDate: {
        type: DataTypes.DATE
    },
    deliveryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    failedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    templateId: {
        type: DataTypes.INTEGER
    },
    createdBy: {
        type: DataTypes.STRING
    }
});

module.exports = SMSMessage;
