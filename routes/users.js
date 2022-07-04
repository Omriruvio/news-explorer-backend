const router = require('express').Router();
const jwtauth = require('../middlewares/jwtauth');

// prettier-ignore
const {
  deleteArticle,
  createArticle,
  getSavedArticles,
  getCurrentUser,
} = require('../controllers/auth');

router.get('/users/me', jwtauth, getCurrentUser);

router.get('/articles', jwtauth, getSavedArticles);

router.post('/articles', jwtauth, createArticle);

router.delete('/articles/:articleId', jwtauth, deleteArticle);

module.exports = router;
