import express, { Request, Response } from 'express';
import http2 from 'http2';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import { checkAuthorization } from './middlewares/auth';
import { createUser, login } from './controllers/users';
import { cardsRouter, usersRouter } from './routes';
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
  const databaseErrors = {
    ValidationError: {
      status: 412,
      message: 'Данные не прошли валидацию',
    },
    CastError: {
      status: 400,
      message: 'Невалидный id записи',
    },
    DocumentNotFoundError: {
      status: 406,
      message: 'В базе данных не найдена запись подходящая по параметрам запроса',
    },
  };
  let { statusCode = 500, message } = err;
  type tDatabaseErrorKey = keyof typeof databaseErrors;

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
        : statusCode === 11000
          ? 'Создание дублирующей записи'
          : message,
    });
});
app.use((req, res) => {
  res
    .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    .send({
      message: 'Обращение к несуществующему ресурсу',
    });
});
app.listen(PORT, () => {
});
