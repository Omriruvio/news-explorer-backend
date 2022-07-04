const User = require('../models/user');
const Article = require('../models/article');
const NotFoundError = require('../utils/httperrors/notfounderror');

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
    .orFail(() => new Error('Article list is empty'))
    .then((articles) => res.send(articles))
    .catch(next);
};

// creates an article with the passed keyword, title,
// text, date, source, link, and image in the body
const createArticle = (req, res, next) => {
  // const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ ...req.body, owner: req.user._id })
    .orFail(next)
    .then((article) => res.send(article))
    .catch(next);
};

// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleId)
    .orFail(() => new NotFoundError('Article not found.'))
    .then((deletedArticle) => res.send(deletedArticle))
    .catch(next);
};

module.exports = {
  getCurrentUser,
  getSavedArticles,
  createArticle,
  deleteArticle,
};
