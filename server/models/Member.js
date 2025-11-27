const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
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
    dateOfBirth: {
        type: DataTypes.DATEONLY
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        defaultValue: 'Male'
    },
    class: {
        type: DataTypes.ENUM('Beginners', 'Middle', 'Senior'),
        defaultValue: 'Beginners'
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    parentName: {
        type: DataTypes.STRING
    },
    parentContact: {
        type: DataTypes.STRING
    },
    organization: {
        type: DataTypes.STRING
    },
    joinDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    photo: {
        type: DataTypes.STRING
    },
    // Lifecycle Fields
    status: {
        type: DataTypes.ENUM('New', 'Onboarding', 'Active', 'Inactive', 'Transferred', 'Suspended'),
        defaultValue: 'New'
    },
    membershipClassStatus: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started'
    },
    membershipClassDate: {
        type: DataTypes.DATEONLY
    },
    lastRenewalDate: {
        type: DataTypes.DATEONLY
    }
});

module.exports = Member;
