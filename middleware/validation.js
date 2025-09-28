const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const validateObjectId = (req, res, next) => {
  const id = req.params.recipeId;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};
