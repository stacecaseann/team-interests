const express = require('express');
const router = express.Router();

const validate = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');
const scriptureController = require('../controllers/scriptureController');


router.get('/', asyncHandler(scriptureController.getAllScriptures));

router.get('/:id', 
    validate.validateObjectId,
    asyncHandler(scriptureController.getScriptureById));

router.post('/', 
    validate.validateScriptureData,
    validate.handleValidationErrors,
    asyncHandler(scriptureController.addScripture));

router.put('/:id', 
    validate.validateObjectId,
    validate.validateScriptureData,
    validate.handleValidationErrors,
    asyncHandler(scriptureController.updateScripture));

router.delete('/:id', 
    validate.validateObjectId,
    validate.handleValidationErrors,
    asyncHandler(scriptureController.deleteScripture));

module.exports = router;