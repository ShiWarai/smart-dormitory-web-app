const mongoose = require('mongoose');
const { Schema } = mongoose;

const Contact = new Schema({
    username: String,
    email: String,
    telephone: String,
    mobile: String,
    home: String
});

module.exports = mongoose.model('Contact', Contact);