const express = require('express');
const router = express.Router();

const validate = require('../middleware/validation');
const scriptureController = require('../controllers/scriptureController');

router.get('/', scriptureController.getAllScriptures);

router.get(
  '/:id',
  validate.validateObjectId,
  validate.handleValidationErrors,
  scriptureController.getScriptureById,
);

router.post(
  '/',
  validate.validateScriptureData,
  validate.handleValidationErrors,
  scriptureController.addScripture,
);

router.put(
  '/:id',
  validate.validateObjectId,
  validate.validateScriptureData,
  validate.handleValidationErrors,
  scriptureController.updateScripture,
);

router.delete(
  '/:id',
  validate.validateObjectId,
  validate.handleValidationErrors,
  scriptureController.deleteScripture,
);

module.exports = router;
