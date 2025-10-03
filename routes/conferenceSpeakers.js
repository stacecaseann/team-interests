const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakersController');

router.get('/', speakerController.getAllSpeakers);
router.get('/:id', speakerController.getSpeaker);
router.post('/', speakerController.createSpeaker);
router.put('/:id', speakerController.updateSpeaker);
router.delete('/:id', speakerController.deleteSpeaker);

module.exports = router;
