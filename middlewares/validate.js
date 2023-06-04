const {
  celebrate, Joi,
} = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(4).max(30)
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(4).max(30)
      .default('Исследователь'),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]+#?/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateMeBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30)
      .default('Исследователь'),
  }),
});

const validateUpdateMeAvatar = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]+#?/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.string().required(),
    likes: Joi.array().required().default([]),
    createdAt: Joi.date().default(Date.now),
  }),
});

module.exports = {
  validateUserBody,
  validateLoginBody,
  validateCardBody,
  validateUpdateMeBody,
  validateUpdateMeAvatar,
};
