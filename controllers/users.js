const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.user_id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({
          message: 'Неверный айди пользователя',
        });
        return;
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({
          message: 'Некорректные данные при создании пользователя',
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

const updateMe = (req, res) => {
  if ((req.body.name.length < 2) || (req.body.about.length < 2)
  || (req.body.name.length > 30) || (req.body.about.length > 30)) {
    return res.status(400).send({
      message: 'Переданы некорректные данные при обновлении профиля',
    });
  }
  return userModel.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then(() => res.status(200).send({ name: req.body.name, about: req.body.about }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
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

const updateMeAvatar = (req, res) => {
  userModel.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then(() => res.status(200).send({ avatar: req.body.avatar }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateMe,
  updateMeAvatar,
};
