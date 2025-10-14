const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../categories/Category');
const Article = require('../articles/Article');

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles: articles });
  });
});

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then((category) => {
    res.render('admin/articles/new', { categories: category });
  });
});

router.post('/article/save', (req, res) => {
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.create({
    title: title,
    body: body,
    slug: slugify(title.toLowerCase()),
    categoriaId: category,
  }).then(() => {
    res.redirect('/admin/articles');
  });
});

router.post('/article/delete', (req, res) => {
  var id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect('/admin/articles');
      });
    } else {
      res.redirect('/admin/articles');
    }
  } else {
    res.redirect('/admin/articles');
  }
});

router.get('/admin/article/edit/:id', (req, res) => {
  var id = req.params.id;

  Article.findByPk(id).then((article) => {
    res.render('admin/articles/edit', { article: article });
  });
});

module.exports = router;
