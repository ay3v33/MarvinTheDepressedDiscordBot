const Guild = require('./models/guild');
const Econ = require('./models/econ');
require('dotenv').config();
const Sequelize = require('sequelize');

//Manually add to db
const add = (id, database, username) => {
    if(database == econ) {
        database.findOrCreate({
            where: {userid: null},
            defaults: {
                userid: id,
                username: username, 
                schmeckels: 500,
            }
        });
    }
}

//find something by id in db
const find = (pkey, database) => {
    if (database == Guild) {
        const data = Guild.findOne({ where: { phrase: pkey } });
    } else if(database == Econ) {
        const data = Econ.findOne({ where: { userid: pkey } });
    }
}

//manually remove
const remove = async (id, database) => {
    const data = await database.findOne({ where: { userid: id } });
    data.destroy();
}

//remove(process.env.METH, Econ);

module.exports = {
    add,
    remove
}

