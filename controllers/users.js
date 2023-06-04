const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const userModel = require('../models/user');
const BaseError = require('../utils/errors');
const { signToken } = require('../utils/jwtAuth');

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  userModel
    .findById(req.params.user_id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new BaseError(404, 'Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Неверный айди пользователя'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!(validator.isEmail(email))) {
    return next(new BaseError(400, 'Некорректные email'));
    /* return res.status(400).send({
      message: 'Некорректные email',
    }); */
  }
  return bcrypt.hash(password, 10).then((hash) => {
    // Store hash in your password DB.
    userModel
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => {
        res.status(201).send({
          name, about, avatar, email,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new BaseError(409, 'Такой пользователь уже существует'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BaseError(400, 'Некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      });
  });
};

const updateMe = (req, res, next) => userModel.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  { new: true, runValidators: true },
)
  .then((user) => {
    if (user) {
      res.status(200).send(user);
    } else {
      next(new BaseError(404, 'Пользователь не найден'));
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
      next(new BaseError(400, 'Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  });

const updateMeAvatar = (req, res, next) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new BaseError(404, 'Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Error('UnauthorizedError');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        next(new BaseError(401, 'Email или пароль неверный'));
        return;
      }

      const token = signToken({ _id: user._id });

      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === 'UnauthorizedError') {
        next(new BaseError(401, 'Email или пароль неверный'));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new BaseError(404, 'Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BaseError(400, 'Неверный айди пользователя'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateMe,
  updateMeAvatar,
  login,
  getMe,
};
