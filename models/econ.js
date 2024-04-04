const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Econ = sequelize.define('econ', {
    userid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    marvincoinBalance: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lastDailyCollected: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

module.exports = Econ;