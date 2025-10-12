const mongoose = require('mongoose');

const ProgrammingLanguageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [40, 'Name cannot exceed 40 characters'],
    },
    paradigm: {
      type: [String],
      required: [true, 'Paradigm is required'],
      validate: [(arr) => arr.length > 0, 'At least one paradigm is required'],
    },
    firstAppeared: {
      type: Number,
      required: [true, 'First appeared year is required'],
      min: [1940, 'Year must be after 1940'],
      max: [new Date().getFullYear(), `Year cannot be in the future`],
    },
    creator: {
      type: String,
      required: [true, 'Creator is required'],
      trim: true,
      minlength: [2, 'Creator must be at least 2 characters'],
      maxlength: [40, `Creator cannot exceed 40 characters`],
    },
    website: {
      type: String,
      trim: true,
      maxlength: [100, 'Website cannot exceed 100 characters'],
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Website must be a valid URL',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'ProgrammingLanguage',
  ProgrammingLanguageSchema,
);
