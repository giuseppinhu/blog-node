const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/db');

const categoryController = require('./categories/CategoryController');
const articleController = require('./articles/ArticleController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');

// View Engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('./public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
connection
  .authenticate()
  .then(() => {
    console.log('Connection sucess');
  })
  .catch((error) => {
    console.log(error);
  });

app.get('/', (req, res) => {
  res.render('index');
});

// Render routes
app.use('/', categoryController);

app.use('/', articleController);

app.listen(port, () => {
  console.log(`Servidor rodando: localhost:${port}`);
});
