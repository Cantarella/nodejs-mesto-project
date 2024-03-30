import express, { Request, Response } from 'express';
import http2 from 'http2';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouter from './routes/users';
import { checkAuthorization } from './middlewares/auth';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000 } = process.env;
const allowCors = (req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(cookieParser());
app.use(allowCors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
  }).unknown(true),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
  }),
}), login);
app.use(checkAuthorization);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(errorLogger);

app.use(errors());
app.use((err: any, req: express.Request, res: express.Response) => {
  const databaseErors = ['ValidationError', 'CastError', 'DocumentNotFoundError'];
  // eslint-disable-next-line prefer-const
  let { statusCode = 500, message } = err;
  for (let i = 0, c = databaseErors.length; i < c; i++) {
    if (err.stack.includes(databaseErors[i])) {
      statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
    }
  }

  res
    .status(statusCode)
    .send({
      // eslint-disable-next-line no-nested-ternary
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : statusCode === 11000
          ? 'Создание дублирующей записи'
          : message,
    });
});
app.use((req, res) => {
  res.sendStatus(http2.constants.HTTP_STATUS_NOT_FOUND);
});
app.listen(PORT, () => {
});
