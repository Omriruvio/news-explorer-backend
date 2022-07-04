const router = require('express').Router();
const { createUser, validateUser } = require('../controllers/auth');
const { validateCreateUserRequest, validateLoginRequest } = require('./validation/schemas');

router.post('/signup', validateCreateUserRequest, createUser);

router.post('/signin', validateLoginRequest, validateUser);

module.exports = router;
