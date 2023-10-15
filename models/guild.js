const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Guild = sequelize.define('guild', {
    img:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Guild;