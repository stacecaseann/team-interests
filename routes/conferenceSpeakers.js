const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authentication');
const speakerController = require('../controllers/speakersController');

router.get('/', speakerController.getAllSpeakers);
router.get('/:id', speakerController.getSpeaker);
router.post('/', isAuthenticated, speakerController.createSpeaker);
router.put('/:id', isAuthenticated, speakerController.updateSpeaker);
router.delete('/:id', isAuthenticated, speakerController.deleteSpeaker);

module.exports = router;
