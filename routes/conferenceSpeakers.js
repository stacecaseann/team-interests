const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const speakerController = require('../controllers/speakersController');
const { isAuthenticated } = require('../middleware/authentication');

router.get('/', speakerController.getAllSpeakers);
router.get('/:id', speakerController.getSpeaker);
router.post(
  '/',
  isAuthenticated,
  validation.validateSpeakerData,
  validation.handleValidationErrors,
  speakerController.createSpeaker,
);
router.put(
  '/:id',
  isAuthenticated,
  validation.validateSpeakerUpdateData,
  validation.handleValidationErrors,
  speakerController.updateSpeaker,
);
router.delete('/:id', isAuthenticated, speakerController.deleteSpeaker);

module.exports = router;
