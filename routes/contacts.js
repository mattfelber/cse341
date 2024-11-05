const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');

router.get('/', contactsController.getAll);       // GET all contacts
router.get('/:id', contactsController.getSingle); // GET a single contact by ID
router.post('/', contactsController.createContact); // POST a new contact

module.exports = router;
