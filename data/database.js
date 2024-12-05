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
    const client = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    _db = client.db(); // Assign the database object, not the client
    console.log('Connected to MongoDB');
    return callback(null, _db);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    return callback(err);
  }
};

const getDatabase = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db; // Return the database object
};

module.exports = {
  initDb,
  getDatabase,
};
