require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const centralerrhandler = require('./middlewares/centralerrhandler');
const NotFoundError = require('./utils/httperrors/notfounderror');
const { limiter } = require('./utils/ratelimiter');
const mainRoute = require('./routes');
const { MONGODB_DEV_URL } = require('./utils/constants');

const { PORT = 3000, NODE_ENV, MONGODB_URL = MONGODB_DEV_URL } = process.env;
const app = express();

mongoose.connect(MONGODB_URL);

app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(helmet());

app.use(requestLogger);

app.use('/', mainRoute);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found.'));
});

app.use(errorLogger);

app.use(errors());
app.use(centralerrhandler);

if (NODE_ENV !== 'test') app.listen(PORT);
