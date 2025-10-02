const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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

module.exports = {
  validateObjectId,
};
