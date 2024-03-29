import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getUserData,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('', getAllUsers);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(20).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
  }),
}), updateUser);
usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUserData);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required(),
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

export default usersRouter;
