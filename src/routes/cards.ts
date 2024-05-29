import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  addLikeToCard, createCard, deleteCard, dislike, getCards,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('', getCards);
cardsRouter.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), createCard);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex(),
    }),
  }),
  // @ts-ignore
  deleteCard,
);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
  // @ts-ignore
}), addLikeToCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
  // @ts-ignore
}), dislike);

export default cardsRouter;
