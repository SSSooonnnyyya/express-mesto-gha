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
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь не найден',
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
      if (err.message.startsWith('user validation failed')) {
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
  userModel.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then(() => res.status(200).send())
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
      } else if (err.message.startsWith('user validation failed')) {
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
    .then(() => res.status(200).send())
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
      } else if (err.message.startsWith('user validation failed')) {
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
