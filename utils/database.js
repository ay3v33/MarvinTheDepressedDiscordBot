const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('database', process.env.USER, process.env.PASS, {
    dialect: 'sqlite',
    host: 'localhost',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = sequelize;