const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passport');
// const firebase = require('../config/firebase-init');
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');

let isPhoneNumber = (data) => {
  if (/^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g.test(data)){
    return true;
  }
  return false;
};

router.get('/', (req, res) => {
  res.render('auth');
});

/* jshint ignore:start */

router.post('/register', 
[
  check("r_name").isLength({min: 3}).withMessage("Name must 3 or more characters long."),
  check("r_email").custom(value => {
    return User.checkEmailAvailable(value);
  }),
  check("r_email").isEmail().withMessage("E-mail is Invalid."),
  check("r_password").isLength({ min: 8 }).withMessage("Password must 8 or more characters long."),
  check("r_cpassword").custom((value, { req, loc, path }) => {    
    if (value !== req.body.r_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
    
],
(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  
  firebase.auth().createUser({
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    displayName: req.body.name,
    disabled: false
  }).then((userRecord) => {
      req.session.user = userRecord.uid;
      console.log("Successfully created new user:", userRecord.uid);
      res.status(200).json({msg: "It Works", param: "error"});
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });

});
/* jshint ignore:end */

router.post('/login', 
[
  check("l_email").custom(value => {
    return User.checkEmailExists(value);
  }),
  check('l_email').isEmail().withMessage("E-mail is Invalid."),
  check('l_pwd').isLength({ min: 1 }).withMessage("Password is Invalid.")
], 
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  res.status(200).json({msg: 'It Works!', param: 'error'});
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => res.redirect('/'));

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => res.redirect('/'));


module.exports = router;