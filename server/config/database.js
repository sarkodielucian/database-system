const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = process.env.POSTGRES_URL
    ? new Sequelize(process.env.POSTGRES_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: false
    });

module.exports = sequelize;
