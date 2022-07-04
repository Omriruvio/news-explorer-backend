const router = require('express').Router();
const { createUser, validateUser } = require('../controllers/auth');

router.post('/signup', createUser);

router.post('/signin', validateUser);

module.exports = router;
