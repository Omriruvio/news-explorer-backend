const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_DEV_SECRET } = require('../utils/constants');
const AuthorizationError = require('../utils/httperrors/authorizationerror');
const ConflictError = require('../utils/httperrors/conflicterror');
const ValidationError = require('../utils/httperrors/validationerror');
const { UNAUTHORIZED } = require('../utils/httpstatuscodes');

const { JWT_SECRET, NODE_ENV } = process.env;

// returns information about the logged-in user (email and name)
const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};

// creates a user with the passed email, password, and name in the body
const createUser = (req, res, next) => {
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ email, name, password: hash })
        .then((user) => {
          res.send({ name, email, _id: user._id });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('User already esists.'));
          } else next(err);
        });
    })
    .catch(next);
};

// checks the email and password passed in the body and returns a JWT
const validateUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('password')
    .then((user) => {
      if (!user) {
        next(new ValidationError('User was not found.', UNAUTHORIZED));
        return;
      }
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          next(new AuthorizationError('Incorrect credentials provided.'));
          return;
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET, { expiresIn: '7d' });
        res.send({ token });
      });
    })
    .catch(next);
};

module.exports = { createUser, validateUser, getCurrentUser };
