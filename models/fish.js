const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Guild = sequelize.define('fish', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    rarity: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    value: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
})

module.exports = Guild;