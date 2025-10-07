// routes/favoritebooks.js
const router = require('express').Router();
const favoriteBooksController = require('../controllers/favoriteBooksController');
const {
    validateBookData,
    validateBookArray,
    validateObjectId,
    handleValidationErrors,
} = require('../middleware/validation');

router.get('/', favoriteBooksController.getAllBooks);

router.get('/:bookId', validateObjectId, handleValidationErrors, favoriteBooksController.getBookById);

router.post('/', validateBookData, handleValidationErrors, favoriteBooksController.addBook);

router.post('/createWithArray', validateBookArray, handleValidationErrors, favoriteBooksController.createWithArray);

router.post('/createWithList', validateBookArray, handleValidationErrors, favoriteBooksController.createWithList);

router.put('/:bookId', validateObjectId, validateBookData, handleValidationErrors, favoriteBooksController.updateBook);

router.delete('/:bookId', validateObjectId, handleValidationErrors, favoriteBooksController.deleteBook);

module.exports = router;