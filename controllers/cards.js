const mongoose = require('mongoose');
const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
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
        res.status(400).send({
          message: 'Некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      if (card.owner._id.toString() === req.user._id) {
        return cardModel.findByIdAndRemove(req.params.cardId)
          .then((dbCard) => res.send({ card: dbCard }))
          .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
              res.status(400).send({
                message: 'Некорректный айди карточки',
              });
            } else {
              res.status(500).send({
                message: 'Internal Server Error',
                err: err.message,
                stack: err.stack,
              });
            }
          });
      }
      return res.status(403).send({
        message: 'Нельзя удалять чужие карточки',
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({
          message: 'Некорректный айди карточки',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((dbCard) => {
      if (dbCard) {
        res.send({ card: dbCard });
      } else {
        res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({
          message: 'Некорректный айди карточки',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((dbCard) => {
      if (dbCard) {
        res.send({ card: dbCard });
      } else {
        res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({
          message: 'Некорректный айди карточки',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
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
