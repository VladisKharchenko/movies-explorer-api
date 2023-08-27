const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getUser,
  updateUserProfile,
  logout,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get('/users/me', authMiddleware, getUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().required(),
      }),
  }),
  updateUserProfile,
);

router.get('/signout', logout);

module.exports = router;
