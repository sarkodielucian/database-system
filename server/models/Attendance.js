const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent', 'In School', 'Excused'),
        defaultValue: 'Present'
    },
    checkInTime: {
        type: DataTypes.TIME
    },
    mode: {
        type: DataTypes.ENUM('Manual', 'QR'),
        defaultValue: 'Manual'
    },
    serviceType: {
        type: DataTypes.STRING,
        defaultValue: 'Sunday Service'
    }
});

module.exports = Attendance;
