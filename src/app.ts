import express, { NextFunction, Request, Response } from 'express';
import http2 from 'http2';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import Error404 from './helpers/errors/Error404';
import { checkAuthorization } from './middlewares/auth';
import { createUser, login } from './controllers/users';
import { cardsRouter, usersRouter } from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';

const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000 } = process.env;
const allowCors = (req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(cookieParser());
app.use(allowCors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb');

app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
    name: Joi.string().min(20).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
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
app.use((req: Request, res: Response, next: NextFunction) => next(new Error404('Обращение к несуществующему ресурсу')));
app.use(errorLogger);

app.use(errors());
app.use((err: any, req: express.Request, res: express.Response) => {
  const { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST } = http2.constants;
  const databaseErrors = {
    ValidationError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: 'Данные не прошли валидацию',
    },
    CastError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: 'Невалидный id записи',
    },
    DocumentNotFoundError: {
      status: HTTP_STATUS_NOT_FOUND,
      message: 'В базе данных не найдена запись подходящая по параметрам запроса',
    },
  };
  let { statusCode = 500, message } = err;
  type tDatabaseErrorKey = keyof typeof databaseErrors;

  // eslint-disable-next-line max-len
  const databaseErrorsKeys: tDatabaseErrorKey[] = Object.keys(databaseErrors) as tDatabaseErrorKey[];
  databaseErrorsKeys.forEach((errorKey: tDatabaseErrorKey) => {
    if (err.stack.includes(errorKey)) {
      statusCode = databaseErrors[errorKey].status;
      message = databaseErrors[errorKey].message;
    }
  });
  res
    .status(statusCode)
    .send({
      // eslint-disable-next-line no-nested-ternary
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });
});
app.listen(PORT, () => {
});
