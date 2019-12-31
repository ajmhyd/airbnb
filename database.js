const user = 'abb';
const password = 'airbnb123';
const host = 'localhost';
const database = 'airbnb';

const Sequelize = require('sequelize');

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
