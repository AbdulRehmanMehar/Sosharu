const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
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

app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: "ZeAG3U1g-rjkbq70Ga7vEYW0yxFsgxQTbu0M",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 60000,
    expires: 600000
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.json());
app.set('trust proxy', 1);
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
