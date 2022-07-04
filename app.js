require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const centralerrhandler = require('./middlewares/centralerrhandler');
const NotFoundError = require('./utils/httperrors/notfounderror');
const usersRoute = require('./routes/article');
const authRoute = require('./routes/user');
const { limiter } = require('./utils/ratelimiter');

const { PORT = 3000, NODE_ENV, MONGODB_URL } = process.env;
const app = express();

mongoose.connect(MONGODB_URL);

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
