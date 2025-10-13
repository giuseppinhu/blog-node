const sequelize = require('sequelize');
const connection = require('../database/db');

const Category = connection.define('categorias', {
  title: {
    type: sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Category;
