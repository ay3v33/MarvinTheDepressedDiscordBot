const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Fish = sequelize.define('fish', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.BLOB,
    },
    rarity: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    value: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
})

module.exports = Fish;