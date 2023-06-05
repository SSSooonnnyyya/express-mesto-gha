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
    name: Joi.string().min(2).max(30).required()
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).required()
      .default('Исследователь'),
  }),
});

const validateUpdateMeAvatar = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]+#?/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]+#?/).required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    user_id: Joi.string().required().hex().length(24),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateLoginBody,
  validateCardBody,
  validateUpdateMeBody,
  validateUpdateMeAvatar,
  validateUserId,
  validateCardId,
};
