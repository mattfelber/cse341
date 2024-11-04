const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts); // Corrected `res.status` and removed `serialize`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id); // Corrected `req.params.id` syntax
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts[0]); // Corrected `res.status` and removed `serialize`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
};
