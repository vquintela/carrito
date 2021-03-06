const { Sequelize } = require('sequelize');

const database = 'carrito_node';
const username = 'root';
const password = '';

const sequelize = new Sequelize(database, username, password, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
})
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;