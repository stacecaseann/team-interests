const express = require('express');
const router = express.Router();
const favoriteBooksController = require('../controllers/favoriteBooksController');
const { isAuthenticated } = require('../middleware/authentication');
const {
  validateFavoriteBook,
  handleValidationErrors,
} = require('../middleware/validateFavoriteBooks');

// 🟩 Get all books (requires authentication)
router.get('/', isAuthenticated, favoriteBooksController.getAllBooks);

// 🟩 Get a book by ID (no authentication required for viewing)
router.get('/:bookId', favoriteBooksController.getBookById);

// 🟩 Add a single book (with validation)
router.post(
  '/',
  isAuthenticated,
  validateFavoriteBook,
  handleValidationErrors,
  favoriteBooksController.addBook
);

// 🟩 Create multiple books from an array (validate each)
router.post(
  '/createWithArray',
  isAuthenticated,
  (req, res, next) => {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of books.' });
    }
    // Apply validation rules to each book in the array
    const { body } = require('express-validator');
    return Promise.all(
      req.body.map((book, index) => [
        body(`${index}.title`)
          .notEmpty()
          .withMessage(`Book #${index + 1}: Title is required.`),
        body(`${index}.author`)
          .notEmpty()
          .withMessage(`Book #${index + 1}: Author is required.`),
        body(`${index}.year`)
          .isInt({ min: 1000, max: 2025 })
          .withMessage(`Book #${index + 1}: Year must be valid.`),
      ])
    )
      .then(() => next())
      .catch(next);
  },
  handleValidationErrors,
  favoriteBooksController.createWithArray
);

// 🟩 Create multiple books from a list (similar validation)
router.post(
  '/createWithList',
  isAuthenticated,
  (req, res, next) => {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of books.' });
    }
    const { body } = require('express-validator');
    return Promise.all(
      req.body.map((book, index) => [
        body(`${index}.title`)
          .notEmpty()
          .withMessage(`Book #${index + 1}: Title is required.`),
        body(`${index}.author`)
          .notEmpty()
          .withMessage(`Book #${index + 1}: Author is required.`),
        body(`${index}.year`)
          .isInt({ min: 1000, max: 2025 })
          .withMessage(`Book #${index + 1}: Year must be valid.`),
      ])
    )
      .then(() => next())
      .catch(next);
  },
  handleValidationErrors,
  favoriteBooksController.createWithList
);

// 🟩 Update a book (validate input)
router.put(
  '/:bookId',
  isAuthenticated,
  validateFavoriteBook,
  handleValidationErrors,
  favoriteBooksController.updateBook
);

// 🟩 Delete a book (authentication only)
router.delete('/:bookId', isAuthenticated, favoriteBooksController.deleteBook);

module.exports = router;
