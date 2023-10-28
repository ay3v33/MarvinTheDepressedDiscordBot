const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Econ = sequelize.define('econ', {
    userid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    schmeckels: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lastDailyCollected: {
        type: Sequelize.DATE,
        allowNull: true
    },
    lastDailyCollected: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
    }
})

module.exports = Econ;