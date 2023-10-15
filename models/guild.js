const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Guild = sequelize.define('guild', {

    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Guild;