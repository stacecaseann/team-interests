// Movie Schema
const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    // Title must be between 2 and 70 characters long
    validate: {
      validator: (v) => validator.isLength(v, { min: 2, max: 70 }),
      message: (props) =>
        `${props.value} is invalid. Title must be between 2 and 70 characters long`,
    },
    unique: true,
  },
  // Director must be between 2 and 30 characters long
  director: {
    type: String,
    required: [true, 'director is required'],
    validate: {
      validator: (v) => validator.isLength(v, { min: 2, max: 30 }),
      message: (props) =>
        `${props.value} is invalid. Director must be between 2 and 30 characters long`,
    },
  },
  // Language must be between 2 and 20 characters long
  language: {
    type: String,
    required: [true, 'language is required'],
    validate: {
      validator: (v) => validator.isLength(v, { min: 2, max: 20 }),
      message: (props) =>
        `${props.value} is invalid. Language must be between 2 and 20 characters long`,
    },
  },
  // Year must be an integer between 1970 and the current year
  year: {
    type: Number,
    required: [true, 'year is required'],
    validate: {
      validator: (v) =>
        Number.isInteger(v) && v >= 1970 && v <= new Date().getFullYear(),
      message: (props) =>
        `${props.value} is invalid. Year must be between 1970 and ${new Date().getFullYear()}`,
    },
  },
  // Genre must be an array of strings with at least one genre
  genre: {
    type: [String],
    required: [true, 'genre is required'],
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one genre must be specified',
    },
  },
  // Synopsis must be between 10 and 500 characters long
  synopsis: {
    type: String,
    required: [true, 'synopsis is required'],
    validate: {
      validator: (v) => validator.isLength(v, { min: 10, max: 300 }),
      message:
        'Your synopsis is longer/shorter than allowed. It must be between 10 and 300 characters long',
    },
  },
  // Timestamp of when the movie was added
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('movies', movieSchema);
