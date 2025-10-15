const mongoose = require('mongoose');

const FavoriteBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [1, 'Author cannot be empty'],
      maxlength: [100, 'Author cannot exceed 100 characters'],
    },
    year: {
      type: Number,
      min: [0, 'Year cannot be negative'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('FavoriteBook', FavoriteBookSchema);
