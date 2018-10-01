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


app.set('views', __dirname + '/resources/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(csrf({ cookie: true }));
// app.use(csrfHandler);

// app.use((req, res, next) => {
//   res.locals._csrf = req.csrfToken();
//   next();
// });
// app.use((err, req, res, next) => {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err);
//   res.status(403).json({
//     param: "error",
//     msg: "Invalid CSRF Token"
//   });
// });
app.use('/', mainController);

exports.app = functions.https.onRequest(app);
