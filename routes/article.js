const router = require('express').Router();
const auth = require('../middlewares/auth');

// prettier-ignore
const {
  deleteArticle,
  createArticle,
  getSavedArticles,
} = require('../controllers/articles');
const { validateNewArticleRequest, validateDeleteArticleRequest } = require('./validation/schemas');

router.get('/articles', auth, getSavedArticles);

router.post('/articles', auth, validateNewArticleRequest, createArticle);

router.delete('/articles/:articleId', auth, validateDeleteArticleRequest, deleteArticle);

module.exports = router;
