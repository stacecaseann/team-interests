const router = require('express').Router();
const favoriteBooksController = require('../controllers/favoriteBooksController');
const { isAuthenticated } = require('../middleware/authentication');

router.get('/', isAuthenticated, favoriteBooksController.getAllBooks);
router.get('/:bookId', favoriteBooksController.getBookById);
router.post('/', isAuthenticated, favoriteBooksController.addBook);
router.post(
  '/createWithArray',
  isAuthenticated,
  favoriteBooksController.createWithArray,
);
router.post(
  '/createWithList',
  isAuthenticated,
  favoriteBooksController.createWithList,
);
router.put('/:bookId', isAuthenticated, favoriteBooksController.updateBook);
router.delete('/:bookId', isAuthenticated, favoriteBooksController.deleteBook);

module.exports = router;
