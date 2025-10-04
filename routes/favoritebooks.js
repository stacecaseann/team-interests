const router = require('express').Router();
const favoriteBooksController = require('../controllers/favoriteBooksController');

router.get('/', favoriteBooksController.getAllBooks);
router.get('/:bookId', favoriteBooksController.getBookById);
router.post('/', favoriteBooksController.addBook);
router.post('/createWithArray', favoriteBooksController.createWithArray);
router.post('/createWithList', favoriteBooksController.createWithList);
router.put('/:bookId', favoriteBooksController.updateBook);
router.delete('/:bookId', favoriteBooksController.deleteBook);

module.exports = router;