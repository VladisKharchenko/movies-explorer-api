const mongoose = require('mongoose');
const validator = require('validator');

const defaultName = 'Александр';

function emailValidator(value) {
  return validator.isEmail(value);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: 'Неверный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    default: defaultName,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
