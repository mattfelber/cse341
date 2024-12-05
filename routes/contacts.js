const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', contactsController.getAll);       // GET all contacts
router.get('/:id', contactsController.getSingle); // GET a single contact by ID
router.post('/', isAuthenticated, contactsController.createContact); // POST a new contact (protected)
router.delete('/:id', isAuthenticated, contactsController.deleteContact); // DELETE a contact (protected)

module.exports = router;
