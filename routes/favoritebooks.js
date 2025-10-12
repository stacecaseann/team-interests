const express = require('express');
const router = express.Router();
const favoriteBooksController = require('../controllers/favoriteBooksController');
const { isAuthenticated } = require('../middleware/authentication');

// --- Public routes ---
router.get('/', favoriteBooksController.getAllBooks);
router.get('/:bookId', favoriteBooksController.getBookById);

// --- Protected routes (require login) ---
router.post('/', isAuthenticated, favoriteBooksController.addBook);
router.post('/createWithArray', isAuthenticated, favoriteBooksController.createWithArray);
router.put('/:bookId', isAuthenticated, favoriteBooksController.updateBook);
router.delete('/:bookId', isAuthenticated, favoriteBooksController.deleteBook);

module.exports = router;
