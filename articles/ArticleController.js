const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then((category) => {
    res.render('admin/articles/new', { categories: category });
  });
});

module.exports = router;
