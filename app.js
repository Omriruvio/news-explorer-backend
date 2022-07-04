require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const centralerrhandler = require('./middlewares/centralerrhandler');
const NotFoundError = require('./utils/httperrors/notfounderror');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');

const { PORT = 3333, NODE_ENV } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect('mongodb://0.0.0.0:27017/news-explorer');

app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(helmet());

app.use(requestLogger);

app.use('/', authRoute, usersRoute);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found.'));
});

app.use(errorLogger);

app.use(errors());
app.use(centralerrhandler);

if (NODE_ENV !== 'test') app.listen(PORT);
