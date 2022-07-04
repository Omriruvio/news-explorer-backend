const Article = require('../models/article');
const NotFoundError = require('../utils/httperrors/notfounderror');
const AuthorizationError = require('../utils/httperrors/authorizationerror');
const { UNAUTHORIZED } = require('../utils/httpstatuscodes');

// returns all articles saved by the user
const getSavedArticles = (req, res, next) => {
  Article.find({})
    .select('+owner')
    .then((articles) => {
      const userArticles = articles.filter((article) => String(article.owner) === req.user._id);
      if (userArticles.length === 0) {
        next(new NotFoundError('Article list is empty'));
        return;
      }
      res.send(userArticles);
    })
    .catch(next);
};

// creates an article with the passed keyword, title,
// text, date, source, link, and image in the body
const createArticle = (req, res, next) => {
  // const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ ...req.body, owner: req.user._id })
    .then((article) => res.send(article))
    .catch(next);
};

// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('owner')
    .then((foundArticle) => {
      if (!foundArticle) {
        next(new NotFoundError('Article not found!'));
        return;
      }
      if (req.user._id !== String(foundArticle.owner)) {
        next(new AuthorizationError("Cannot delete other users' articles.", UNAUTHORIZED));
        return;
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((deletedArticle) => res.send(deletedArticle))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  createArticle,
  deleteArticle,
};
