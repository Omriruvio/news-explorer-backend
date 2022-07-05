const router = require('express').Router();
const { createUser, validateUser, getCurrentUser } = require('../controllers/users');
const { validateCreateUserRequest, validateLoginRequest } = require('./validation/schemas');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getCurrentUser);

router.post('/signup', validateCreateUserRequest, createUser);

router.post('/signin', validateLoginRequest, validateUser);

module.exports = router;
