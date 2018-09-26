const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mainController = require('./controllers/main');

app.set('views', __dirname + '/resources/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', mainController);

exports.app = functions.https.onRequest(app);
