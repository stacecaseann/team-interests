const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authentication');

const programmingLanguagesController = require('../controllers/programmingLanguagesController');
const {
  validateObjectId,
  validateProgrammingLanguageData,
  handleValidationErrors,
} = require('../middleware/validation');

router.get('/', programmingLanguagesController.getLanguages);

router.get(
  '/:id',
  validateObjectId,
  programmingLanguagesController.getLanguageById,
);

router.post(
  '/',
  isAuthenticated,
  validateProgrammingLanguageData,
  handleValidationErrors,
  programmingLanguagesController.createLanguage,
);

router.put(
  '/:id',
  isAuthenticated,
  validateObjectId,
  validateProgrammingLanguageData,
  handleValidationErrors,
  programmingLanguagesController.updateLanguage,
);

router.delete(
  '/:id',
  isAuthenticated,
  validateObjectId,
  programmingLanguagesController.deleteLanguage,
);

module.exports = router;
