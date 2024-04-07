const Guild = require('./models/guild');
const Econ = require('./models/econ');

//Guild.sync({alter: true}); //updates database
Econ.sync({alter: true}); //updates database


/*Econ.drop({ tableName: 'Econs' })
  .then(() => {
    console.log('Table "Econs" dropped successfully.');
  })
  .catch(err => {
    console.error('Error dropping table:', err);
  });
*/