const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contacts').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').findOne({ _id: userId });
    if (!result) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

const createContact = async (req, res) => {
  try {
    const newContact = req.body;
    const result = await mongodb.getDatabase().db().collection('contacts').insertOne(newContact);
    res.status(201).json({ message: `Contact created with ID: ${result.insertedId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact
};
