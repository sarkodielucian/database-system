const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cluster = sequelize.define('Cluster', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    leader: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    lastMeetingDate: {
        type: DataTypes.DATEONLY
    },
    nextMeetingDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    description: {
        type: DataTypes.TEXT
    }
});

module.exports = Cluster;
