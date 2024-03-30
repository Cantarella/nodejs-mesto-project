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
    link: Joi.string().required(),
    owner: Joi.string().required(),
  }),
}), createCard);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }),
  deleteCard,
);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), addLikeToCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), dislike);

export default cardsRouter;
