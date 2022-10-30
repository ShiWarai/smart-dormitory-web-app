const express = require('express');
var mongoose = require('mongoose');
const router = express.Router();

const Contact = require('../models/Contact');

router.get('/:id', async (req, res) => {
   res.json(await Contact.findById(mongoose.Types.ObjectId(req.params.id)));
});

router.put('/:id', async (req, res) => {
   await Contact.findByIdAndUpdate(req.params.id, req.body);
   res.json();
});

router.delete('/:id', async (req, res) => {
   await Contact.findByIdAndRemove(req.params.id);
   res.json();
});

module.exports = router;