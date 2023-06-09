const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCardBody, validateCardId } = require('../middlewares/validate');

router.get('/', cardsController.getCards);

router.post('/', validateCardBody, cardsController.createCard);

router.delete('/:cardId', validateCardId, cardsController.deleteCard);

router.put('/:cardId/likes', validateCardId, cardsController.likeCard);

router.delete('/:cardId/likes', validateCardId, cardsController.dislikeCard);

module.exports = router;
