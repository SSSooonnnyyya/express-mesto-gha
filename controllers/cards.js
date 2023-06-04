const mongoose = require('mongoose');
const cardModel = require('../models/card');
const BaseError = require('../utils/errors');

const getCards = (req, res, next) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  cardModel
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BaseError(400, 'Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new BaseError(404, 'Карточка не найдена'));
      }
      if (card.owner._id.toString() === req.user._id) {
        return cardModel.findByIdAndRemove(req.params.cardId)
          .then((dbCard) => res.send({ card: dbCard }))
          .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
              next(new BaseError(400, 'Некорректный айди карточки'));
            } else {
              next(err);
            }
          });
      }
      return next(new BaseError(403, 'Нельзя удалять чужие карточки'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Некорректный айди карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((dbCard) => {
      if (dbCard) {
        return res.send({ card: dbCard });
      }
      return next(new BaseError(404, 'Карточка не найдена'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Некорректный айди карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((dbCard) => {
      if (dbCard) {
        res.send({ card: dbCard });
      } else {
        next(new BaseError(404, 'Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Некорректный айди карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
