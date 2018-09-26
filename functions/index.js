const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.send('It Works!');
});

exports.app = functions.https.onRequest(app);
