const HOSTNAME = process.argv[2].split('=')[1]
const PORT = process.argv[3].split('=')[1]

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

app.get('/', function(req, res) {
   res.render(path.join(__dirname, '../public/index'), {HOSTNAME: HOSTNAME, PORT: PORT});
 });

app.listen(80);
console.log("Server is start!");