import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import Error400 from '../helpers/errors/Error400';
import Error404 from '../helpers/errors/Error404';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send(err));

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.body.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => next(new Error400('Переданы некорректные данные при создании карточки')));
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) throw new Error404(' Карточка с указанным _id не найдена');
      res.send({ data: 'Карточка успешно удалена' });
    })
    .catch((next));
};

export const addLikeToCard = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) throw new Error404('Передан несуществующий _id карточки');
      res.send({ data: 'Лайк поставлен' });
    })
    .catch(() => next(new Error400('Переданы некорректные данные для постановки/снятии лайка')));
};

export const dislike = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) throw new Error404('Передан несуществующий _id карточки');
      res.send({ data: 'Лайк отменён' });
    })
    .catch(() => next(new Error400('Переданы некорректные данные для постановки/снятии лайка')));
};
