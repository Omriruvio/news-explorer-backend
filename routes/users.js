const router = require('express').Router();
const jwtauth = require('../middlewares/jwtauth');

// prettier-ignore
const {
  deleteArticle,
  createArticle,
  getSavedArticles,
  getCurrentUser,
} = require('../controllers/users');
const { validateNewArticleRequest, validateDeleteArticleRequest } = require('./validation/schemas');

router.get('/users/me', jwtauth, getCurrentUser);

router.get('/articles', jwtauth, getSavedArticles);

router.post('/articles', jwtauth, validateNewArticleRequest, createArticle);

router.delete('/articles/:articleId', jwtauth, validateDeleteArticleRequest, deleteArticle);

module.exports = router;
