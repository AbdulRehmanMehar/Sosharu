const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const app = express();
const mainController = require('./controllers/main');
const csrfHandler = require('./middlewares/csrf-handler');


// ------------------------------------------------------
//                     Views Setup
// ------------------------------------------------------

app.set('views', __dirname + '/resources/views'); 
app.set('view engine', 'pug');

// ------------------------------------------------------
//                     Express Modules
// ------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.json());
app.use(cookieParser()); 
app.use(compression()); // makes app faster

// ------------------------------------------------------
//                     Securing the App
// ------------------------------------------------------

app.disable('x-powered-by');
app.use(helmet());
app.use(csrf({ cookie: true })); // csrf protection
app.use(csrfHandler); // handler for csrf

// ------------------------------------------------------
//                     Controllers
// ------------------------------------------------------

app.use('/', mainController);



exports.app = functions.https.onRequest(app);
