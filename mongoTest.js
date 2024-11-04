const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let contactsCollection;

async function connectDB() {
  await client.connect();
  const database = client.db("cse341"); // Database name
  contactsCollection = database.collection("contacts"); // Collection name
  console.log("Connected to MongoDB");
}

// Connect to the database when the server starts
connectDB().catch(console.error);

// POST: Create a new contact
app.post('/contacts', async (req, res) => {
  try {
    const result = await contactsCollection.insertOne(req.body);
    res.status(201).json({ message: `Contact created with ID: ${result.insertedId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// GET: Retrieve all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await contactsCollection.find().toArray();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET: Retrieve a single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await contactsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// PUT: Update a contact by ID
app.put('/contacts/:id', async (req, res) => {
  try {
    const result = await contactsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE: Remove a contact by ID
app.delete('/contacts/:id', async (req, res) => {
  try {
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// List all databases (for testing purposes)
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
