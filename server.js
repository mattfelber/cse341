require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Global database variable
let contactsCollection;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('cse341'); // Database name
    contactsCollection = db.collection('contacts'); // Assign contacts collection globally
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the application if the connection fails
  }
};

// Routes

// Root route: Displays "Logged Out" or "Logged In" based on session
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.send(`<h1>Logged In as ${req.session.user.displayName}</h1>`);
  } else {
    res.send('<h1>Logged Out</h1>');
  }
});

// GitHub OAuth
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Login route
app.get('/login', passport.authenticate('github'));

// GitHub callback route
app.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/'));
  });
});

// Contacts API
// GET: Retrieve all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await contactsCollection.find().toArray();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET: Retrieve a single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await contactsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST: Create a new contact
app.post('/contacts', async (req, res) => {
  try {
    const result = await contactsCollection.insertOne(req.body);
    res.status(201).json({ message: `Contact created with ID: ${result.insertedId}` });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
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
    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE: Remove a contact by ID
app.delete('/contacts/:id', async (req, res) => {
  try {
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server after connecting to database
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
