const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const express = require('express');
const flash = require("connect-flash");
const keys = require('./config/keys');
const firebase = require('./config/firebase-init');
const authController = require('./controllers/auth');
const authHandler = require('./middlewares/authHandler');
const isAuthenticated = require('./middlewares/isAuthenticated');
const queries = require('./middlewares/queries');
const app = express();

// ------------------------------------------------------
//                     Views Setup
// ------------------------------------------------------

app.set('trust proxy', 1);
app.set('views', __dirname + '/resources/views');
app.set('view engine', 'pug');

// ------------------------------------------------------
//                     Express Modules
// ------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  name: "__session",
  secret: keys.encKey,
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: false
  },
  store: new FirebaseStore({
    database: firebase.database()
  }),
}));
// app.use(csrf({ cookie: true }))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// app.use(compression()); // makes app faster
app.use(flash());

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

// app.use(authHandler); // Removes cookie from browser if user isn't authenticated. 
app.use(queries); // Handles queries in url
app.use(isAuthenticated);
app.use('/auth', authController);
app.get('/', (req, res) => {
  if (req.user) {
    res.send('You\'re Logged In' + req.user);
  } else {
    res.redirect('/auth');
  }
});



exports.app = functions.https.onRequest(app);
