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
    userId: Joi.string().hex(),
  }),
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(20).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUserData);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateAvatar);

export default usersRouter;
