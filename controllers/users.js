const User = require('../models/user');
const Article = require('../models/article');
const NotFoundError = require('../utils/httperrors/notfounderror');
const AuthorizationError = require('../utils/httperrors/authorizationerror');
const { UNAUTHORIZED } = require('../utils/httpstatuscodes');

// returns information about the logged-in user (email and name)
const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail(() => next(new NotFoundError('User Id was not found.')))
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};

// returns all articles saved by the user
const getSavedArticles = (req, res, next) => {
  Article.find({})
    .orFail(() => new NotFoundError('Article list is empty'))
    .then((articles) => res.send(articles))
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
    .orFail(() => next(new NotFoundError('Article not found')))
    .then((foundArticle) => {
      // Validates that current user is the owner of the requested article to be deleted.
      if (req.user._id !== String(foundArticle.owner)) {
        throw new AuthorizationError("Cannot delete other users' articles.", UNAUTHORIZED);
      }
      Article.findByIdAndRemove(req.params.articleId)
        .orFail(() => new NotFoundError('Article not found.'))
        .then((deletedArticle) => res.send(deletedArticle))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  getSavedArticles,
  createArticle,
  deleteArticle,
};
