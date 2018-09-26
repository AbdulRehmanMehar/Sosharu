const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('views', __dirname + '/resources/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.render('index');
});

exports.app = functions.https.onRequest(app);
