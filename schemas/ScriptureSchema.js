const mongoose = require('mongoose');
const validator = require('validator');

const ScriptureSchema = new mongoose.Schema({
  book: {
    type: String,
    required: [true, 'Book is required'],
    trim: true,
    validate: {
      validator: (v) => validator.isLength(v, { min: 3, max: 25 }),
      message: (props) =>
        `${props.value} is invalid. Book must be between 3 and 25 characters.`,
    },
  },
  chapter: {
    type: String,
    required: [true, 'Chapter is required'],
    trim: true,
    validate: {
      validator: (v) => validator.isLength(v, { min: 1, max: 2 }),
      message: (props) =>
        `${props.value} is invalid. Chapter must be between 1 or 2 digits.`,
    },
  },
  verse: {
    type: String,
    required: [true, 'Verse(s) must be included'],
    trim: true,
    validate: {
      validator: (v) => validator.isLength(v, { min: 1, max: 25 }),
      message: (props) =>
        `${props.value} is invalid. Verse(s) must be 25 characters or less.`,
    },
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    validate: {
      validator: (v) => validator.isLength(v, { min: 1, max: 1000 }),
      message: (props) =>
        `${props.value} is invalid. Text must be 1000 characters or less.`,
    },
  },
});

module.exports = mongoose.model('Scripture', ScriptureSchema);
