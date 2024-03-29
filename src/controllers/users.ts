import { NextFunction, Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Error500 from '../helpers/errors/Error500';
import { SessionRequest } from '../middlewares/auth';
import User from '../models/user';
import Error404 from '../helpers/errors/Error404';
import Error400 from '../helpers/errors/Error400';

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

// eslint-disable-next-line max-len
export const getUserById = (req: Request, res: Response, next: NextFunction) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new Error404('Пользователь с указанным _id не найден');
    }
    res.send({ data: user });
  })
  .catch(next);

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!isEmail(email)) return next(new Error400('Переданы некорректные данные при создании пользователя'));
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    const hash = await bcrypt.hash(password, 10);
    return User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => next(new Error400(`Переданы некорректные данные при создании пользователя: ${err}`)));
  }
  return next(new Error500('Такой пользователь уже есть в системе'));
};

export const getUserData = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findOne({ _id: userId }).then((user) => {
    res.send(user);
  })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user: any) => {
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { });
    res
      .send({
        token,
      });
  })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
  } = req.body;
  return User.findOneAndUpdate({ _id: req.body.user._id }, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const updateAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    const { avatar } = req.body;
    const { id: userId } = req.user;
    return User.findOneAndUpdate({ _id: userId }, { avatar })
      .then((user) => {
        if (!user) {
          throw new Error404('Пользователь с указанным _id не найден');
        }
        res.send({ data: user });
      })
      .catch(next);
  }
};
