const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Attendance', 'Financial', 'Member', 'Ministry', 'Custom'),
        allowNull: false
    },
    dateRange: {
        type: DataTypes.JSON, // { start: date, end: date }
        allowNull: false
    },
    format: {
        type: DataTypes.ENUM('PDF', 'Excel', 'CSV', 'JSON'),
        defaultValue: 'PDF'
    },
    status: {
        type: DataTypes.ENUM('Generating', 'Completed', 'Failed'),
        defaultValue: 'Generating'
    },
    fileUrl: {
        type: DataTypes.STRING
    },
    parameters: {
        type: DataTypes.JSON // Additional filter parameters
    },
    generatedBy: {
        type: DataTypes.STRING
    },
    fileSize: {
        type: DataTypes.INTEGER // in bytes
    }
});

module.exports = Report;
