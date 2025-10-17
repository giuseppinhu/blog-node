const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/db');
const session = require('express-session');

const categoryController = require('./categories/CategoryController');
const articleController = require('./articles/ArticleController');
const userController = require('./users/UserController');

// Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');

// Sessions
app.use(
  session({
    secret: 'qualquercoisa',
    cookie: { maxAge: 300000000 },
  }),
);

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

// Home page
app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4,
  })
    .then((articles) => {
      // Categories NavBar
      Category.findAll().then((categories) => {
        res.render('index', { articles: articles, categories: categories });
      });
    })
    .catch((error) => {
      res.redirect('/');
    });
});

// Article page
app.get('/article/:slug', (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      // Categories NavBar
      Category.findAll().then((categories) => {
        res.render('article', { article: article, categories: categories });
      });
    })
    .catch((error) => {
      res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;

  // Compare slug to slug DB
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        // Categories NavBar
        Category.findAll().then((categories) => {
          res.render('index', { articles: category.articles, categories: categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((error) => {
      res.redirect('/');
    });
});

// Render routes
app.use('/', categoryController);

app.use('/', articleController);

app.use('/', userController);

app.listen(port, () => {
  console.log(`Servidor rodando: localhost:${port}`);
});
