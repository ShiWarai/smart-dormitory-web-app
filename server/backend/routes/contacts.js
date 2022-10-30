const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');

router.get('/', async (req, res) => {
   res.json(await Contact.find());
});

router.post('/', async (req, res) => {
   const contact = new Contact(req.body);
   await contact.save();
   res.json();
});

router.delete('/', async (req, res) => {
   await Contact.deleteMany({});
   res.json();
});

module.exports = router;