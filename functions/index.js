const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const mainController = require('./controllers/auth');
const authHandler = require('./middlewares/authHandler');
const isAuthenticated = require('./middlewares/isAuthenticated');
const app = express();

// ------------------------------------------------------
//                     Views Setup
// ------------------------------------------------------

app.set('views', __dirname + '/resources/views'); 
app.set('view engine', 'pug');

// ------------------------------------------------------
//                     Express Modules
// ------------------------------------------------------

app.set('trust proxy', 1);
app.use(cookieSession({
  maxAge: 15 * 24 * 60 * 60 * 1000,
  keys: [keys.session.enctryptionkey]
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(compression()); // makes app faster

// ------------------------------------------------------
//                     Securing the App
// ------------------------------------------------------

app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(helmet.frameguard('deny'));
app.use(helmet.hsts({maxAge: 7776000000, includeSubdomains: true}));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.noCache());

// ------------------------------------------------------
//                     Controllers & Middlewares
// ------------------------------------------------------

app.use(authHandler); // Removes cookie from browser if user isn't authenticated. 
app.use('/auth', mainController);
app.get('/', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.send('You\'re Logged In');
  } else {
    res.redirect('/auth');
  }
});



exports.app = functions.https.onRequest(app);
