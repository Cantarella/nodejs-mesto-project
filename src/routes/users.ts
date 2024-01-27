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
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateUser);
usersRouter.get('/me', getUserData);
usersRouter.patch('/me/avatar', updateAvatar);

export default usersRouter;
