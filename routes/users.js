const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');

const userController = require('../controllers/userController');

router.get('/', asyncHandler(userController.displayUsers));
router.get('/:username', asyncHandler(userController.getUser));

module.exports = router;
