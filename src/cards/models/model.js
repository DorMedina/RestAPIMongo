const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 25,
  },
  description: {
    type: String,
    minLength: 10,
    maxLength: 100,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    minLength: 9,
    maxLength: 10,
  },
  address: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 7,
    unique: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const card = mongoose.model('Card', cardSchema);

module.exports = card;
