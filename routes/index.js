const router = require('express').Router();
const articleRoute = require('./article');
const userRoute = require('./user');

router.use(userRoute, articleRoute);

module.exports = router;
