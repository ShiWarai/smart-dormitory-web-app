const HOSTNAME = process.argv[2].split('=')[1]
const PORT = process.argv[3].split('=')[1]

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

mongoose.connect('mongodb://root:password@db:27017/', { useNewUrlParser: true }).
   then(db => console.log('[OK] DB is connected')).
   catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use('/contact', require('./routes/contact'));
app.use('/contacts', require('./routes/contacts'));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

app.get('/', function(req, res) {
   res.render(path.join(__dirname, '../public/index'), {HOSTNAME: HOSTNAME, PORT: PORT});
 });

app.listen(PORT);
console.log("Server is start!");