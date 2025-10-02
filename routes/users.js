const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.displayUsers);
router.get('/:username', userController.getUser);

module.exports = router;
