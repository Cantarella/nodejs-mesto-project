import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import checkAuthorization from './middlewares/auth';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUser);
app.post('/signin', login);
app.use(checkAuthorization);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err: any, req: express.Request, res: express.Response) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });
});
app.listen(PORT, () => {
});
