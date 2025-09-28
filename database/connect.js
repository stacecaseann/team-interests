const dotenv = require('dotenv');
dotenv.config();
// const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');

let _isConnected = false;

const initDb = async (callback) => {
  if (_isConnected) {
    console.log('Db is already initialized!');
    return callback(null, mongoose.connection);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    _isConnected = true;
    console.log('MongoDB connected');
    callback(null, mongoose.connection);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return mongoose.connection;
};

module.exports = {
  initDb,
  getDb,
};
