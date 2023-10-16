const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Guild = sequelize.define('guild', {

    userid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imglink: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phrase: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    usersentid: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Guild;