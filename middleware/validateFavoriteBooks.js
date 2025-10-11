// middleware/validateFavoriteBooks.js
const { body, validationResult } = require('express-validator');

// Validation rules for a single favorite book
const validateFavoriteBook = [
    body('title')
        .notEmpty()
        .withMessage('Title is required.')
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters.'),
    body('author')
        .notEmpty()
        .withMessage('Author is required.')
        .isLength({ min: 2, max: 60 })
        .withMessage('Author must be between 2 and 60 characters.'),
    body('year')
        .notEmpty()
        .withMessage('Year is required.')
        .isInt({ min: 1000, max: 2025 })
        .withMessage('Year must be a valid 4-digit number between 1000 and 2025.'),
    body('genre')
        .optional()
        .isString()
        .withMessage('Genre must be a string.')
        .isLength({ min: 2, max: 30 })
        .withMessage('Genre must be between 2 and 30 characters.'),
];

// Handle validation errors globally
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateFavoriteBook,
    handleValidationErrors,
};
