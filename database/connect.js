const mongoose = require('mongoose');

let _isConnected;

// Changed initDb to return a promise instead of using a callback
const initDb = async () => {
  if (_isConnected) {
    console.log('Db is already initialized!');
    return _isConnected;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    _isConnected = mongoose.connection;
    console.log('MongoDB connected');

    return _isConnected;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    // callback(err);  // Removed callback to simplify the function
    throw err;
  }
};

// Changed getDb to throw an error if the database is not initialized
const getDb = () => {
  // Check if the database is initialized and changed _db to _isConnected
  if (!_isConnected) {
    throw Error('Db not initialized');
  }
  return mongoose.connection;
};

module.exports = {
  initDb,
  getDb,
};
