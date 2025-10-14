const Sequelize = require('sequelize');

const connection = new Sequelize('blognode', 'root', '150725', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00',
});

module.exports = connection;
