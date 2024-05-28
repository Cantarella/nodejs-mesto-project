import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import Error403 from '../helpers/errors/Error403';
import { SessionRequest } from '../middlewares/auth';

export const getCards = async (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { owner } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      const { HTTP_STATUS_CREATED } = constants;
      res
        .status(HTTP_STATUS_CREATED)
        .send({ data: card });
    })
    .catch(next);
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { id } = req.user;
  return Card.deleteOne({ _id: req.params.cardId, owner: id })
    .then((card) => {
      if (!card) next(new Error403('Запрет на удаление записи из базы'));
      res.send({ data: 'Карточка успешно удалена' });
    })
    .catch(next);
};
export const addLikeToCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { id: userId } = req.user;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

export const dislike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { id: userId } = req.user;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};
