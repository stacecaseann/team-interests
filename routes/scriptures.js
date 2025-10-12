const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const scriptureController = require('../controllers/scriptureController');
const { isAuthenticated } = require('../middleware/authentication');

router.get('/', scriptureController.getAllScriptures);

router.get(
  '/:id',
  validate.validateObjectId,
  scriptureController.getScriptureById,
);

router.post(
  '/',
  isAuthenticated,
  validate.validateScriptureData,
  validate.handleValidationErrors,
  scriptureController.addScripture,
);

router.put(
  '/:id',
  isAuthenticated,
  validate.validateObjectId,
  validate.validateScriptureData,
  validate.handleValidationErrors,
  scriptureController.updateScripture,
);

router.delete(
  '/:id',
  isAuthenticated,
  validate.validateObjectId,
  validate.handleValidationErrors,
  scriptureController.deleteScripture,
);

module.exports = router;
