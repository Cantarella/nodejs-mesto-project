import { Router } from 'express';
import { addLikeToCard, createCard, deleteCard, dislike, getCards } from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('', getCards);
cardsRouter.post('', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addLikeToCard);
cardsRouter.delete('/:cardId/likes', dislike);

export default cardsRouter;
