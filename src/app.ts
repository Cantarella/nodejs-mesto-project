import express from 'express';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouter from './routes/users';
import { checkAuthorization } from './middlewares/auth';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();
const { PORT = 3000 } = process.env;

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
  const { statusCode = 500, message } = err;

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
app.listen(PORT, () => {
});
