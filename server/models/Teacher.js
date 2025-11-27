const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Super', 'HoD', 'Teacher', 'Helper'),
        defaultValue: 'Teacher'
    },
    class: {
        type: DataTypes.STRING,
        defaultValue: 'All Classes'
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: DataTypes.STRING
    },
    maritalStatus: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        defaultValue: 'Single'
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    employmentStatus: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Volunteer'),
        defaultValue: 'Volunteer'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    joinDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    emergencyContactName: {
        type: DataTypes.STRING
    },
    emergencyContactPhone: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING // Path or URL to photo
    },
    documents: {
        type: DataTypes.JSON, // Array of { name, url }
        defaultValue: []
    },
    customFields: {
        type: DataTypes.JSON, // Key-value pairs
        defaultValue: {}
    }
});

module.exports = Teacher;
