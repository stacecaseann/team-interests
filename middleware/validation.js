const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const { ObjectId } = mongoose.Types;
const Recipe = require('../schemas/RecipeSchema');

const validateObjectId = (req, res, next) => {
  const id = req.params._id || req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  return next();
};

const validateMovieData = [
  body('title')
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 2, max: 70 })
    .withMessage('Title must be between 2 and 70 characters.'),
  body('director')
    .notEmpty()
    .withMessage('Director is required.')
    .isLength({ min: 2, max: 30 })
    .withMessage('Director must be between 2 and 30 characters.'),
  body('language')
    .notEmpty()
    .withMessage('Language is required.')
    .isLength({ min: 2, max: 20 })
    .withMessage('Languages must be between 2 and 20 characters.'),
  body('year')
    .notEmpty()
    .withMessage('Year is required.')
    .isNumeric()
    .withMessage('Year must be a number.')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year must be 4 digits.'),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required.')
    .isArray({ min: 1 })
    .withMessage('At least one genre must be specified.'),
  body('genre.*')
    .isString()
    .withMessage('Genre must be a string.')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Genre must be between 2 and 15 characters.')
    .notEmpty()
    .withMessage('Genre cannot be empty.'),
  body('synopsis')
    .notEmpty()
    .withMessage('Synopsis is required.')
    .isLength({ min: 10, max: 300 })
    .withMessage('Synopsis must be between 10 and 300 characters.'),
];

const validateRecipeRules = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),
  body('serves')
    .isInt({ min: 1 })
    .withMessage('Serves must be an integer greater than 0')
    .notEmpty()
    .withMessage('Serves is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients must be a non-empty array'),
  body('ingredients.*.amount')
    .isFloat({ gt: 0 })
    .withMessage('Ingredient amount must be a number greater than 0')
    .notEmpty()
    .withMessage('Ingredient amount is required'),
  body('ingredients.*.amountString')
    .isString()
    .withMessage('Ingredient amountString must be a string')
    .notEmpty()
    .withMessage('Ingredient amountString is required'),
  body('ingredients.*.measurement')
    .isString()
    .withMessage('Ingredient measurement must be a string')
    .notEmpty()
    .withMessage('Ingredient measurement is required'),
  body('ingredients.*.measurementDescription')
    .optional()
    .isString()
    .withMessage('Ingredient measurementDescription must be a string'),
  body('ingredients.*.ingredient')
    .isString()
    .withMessage('Ingredient name must be a string')
    .notEmpty()
    .withMessage('Ingredient name is required'),
  body('ingredients.*.ingredientDescription')
    .optional()
    .isString()
    .withMessage('Ingredient description must be a string'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('Instructions must be a non-empty array'),
  body('instructions.*.stepNumber')
    .isInt({ min: 1 })
    .withMessage('Instruction stepNumber must be an integer greater than 0')
    .notEmpty()
    .withMessage('Step Number is required'),
  body('instructions.*.instruction')
    .isString()
    .withMessage('Instruction must be a string')
    .notEmpty()
    .withMessage('Instruction is required'),
];

const validateRecipeUpdateRules = [
  body('name').isString().withMessage('Name must be a string'),
  body('serves')
    .isInt({ min: 1 })
    .withMessage('Serves must be an integer greater than 0'),
  body('description').isString().withMessage('Description must be a string'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients must be a non-empty array'),
  body('ingredients.*.amount')
    .isFloat({ gt: 0 })
    .withMessage('Ingredient amount must be a number greater than 0'),
  body('ingredients.*.amountString')
    .isString()
    .withMessage('Ingredient amountString must be a string')
    .notEmpty()
    .withMessage('Ingredient amountString is required'),
  body('ingredients.*.measurement')
    .isString()
    .withMessage('Ingredient measurement must be a string')
    .notEmpty()
    .withMessage('Ingredient measurement is required'),
  body('ingredients.*.measurementDescription')
    .optional()
    .isString()
    .withMessage('Ingredient measurementDescription must be a string'),
  body('ingredients.*.ingredient')
    .isString()
    .withMessage('Ingredient name must be a string')
    .notEmpty()
    .withMessage('Ingredient name is required'),
  body('ingredients.*.ingredientDescription')
    .optional()
    .isString()
    .withMessage('Ingredient description must be a string'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('Instructions must be a non-empty array'),
  body('instructions.*.stepNumber')
    .isInt({ min: 1 })
    .withMessage('Instruction stepNumber must be an integer greater than 0'),
  body('instructions.*.instruction')
    .isString()
    .withMessage('Instruction must be a string'),
];

const validateRecipeNameRules = [
  body('name')
    .isString()
    .withMessage('Recipe name must be a string')
    .notEmpty()
    .withMessage('Recipe name is required')
    .custom(async (value) => {
      const existing = await Recipe.findOne({ name: value });
      if (existing) {
        throw new Error('Recipe name already in use');
      }
    }),
];

const validateScriptureData = [
  body('book')
    .notEmpty()
    .withMessage('Book is required')
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('Book must be between 3 and 25 characters'),
  body('chapter')
    .notEmpty()
    .withMessage('Chapter is required')
    .trim()
    .isLength({ min: 1, max: 2 })
    .withMessage('Chapter must be 1 or 2 characters'),
  body('verse')
    .notEmpty()
    .withMessage('Verse(s) must be included')
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage('Verse must be between 25 characters or less'),
  body('text')
    .notEmpty()
    .withMessage('Verse(s) must be included')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Verse must be between 1000 characters or less'),
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

module.exports = {
  validateObjectId,
  validateMovieData,
  validateRecipeRules,
  validateRecipeUpdateRules,
  validateRecipeNameRules,
  validateScriptureData,
  handleValidationErrors,
};
