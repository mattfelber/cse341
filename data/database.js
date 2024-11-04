// data/database.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let _db;

const initDb = async (callback) => {
  if (_db) {
    return callback(null, _db);
  }
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    _db = client;
    console.log('Connected to MongoDB');
    return callback(null, _db);
  } catch (err) {
    return callback(err);
  }
};

const getDatabase = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDatabase,
};
