const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../categories/Category');
const Article = require('../articles/Article');
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles: articles });
  });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
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

router.get('/admin/article/edit/:id', adminAuth, (req, res) => {
  var id = req.params.id;

  Article.findByPk(id).then((article) => {
    Category.findAll().then((category) => {
      res.render('admin/articles/edit', { article: article, categories: category });
    });
  });
});

router.post('/article/update', (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.update(
    {
      title: title,
      body: body,
      categoriaId: category,
      slug: slugify(title),
    },
    {
      where: {
        id: id,
      },
    },
  )
    .then(() => {
      res.redirect('/admin/articles');
    })
    .catch((error) => {
      res.redirect('/');
    });
});

router.get('/articles/page/:num', (req, res) => {
  var page = req.params.num;
  var offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = parseInt(page - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [['id', 'DESC']],
  }).then((articles) => {
    var next;
    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    var result = {
      next: next,
      page: parseInt(page),
      articles: articles,
    };

    Category.findAll().then((category) => {
      res.render('admin/articles/page', { result: result, categories: category });
    });
  });
});

module.exports = router;
