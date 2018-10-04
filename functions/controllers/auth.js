const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-init');
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


router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', 
[
  check("name").isLength({min: 3}).withMessage("Name must 3 or more characters long."),
  check("email").custom((value, { req, loc, path }) => {
    return firebase.auth().getUserByEmail(value).then((userRecord) => {
      if(userRecord) {
        return Promise.reject("E-mail already in use.");
      }
    }).catch((err) => {
      if (err.code === 'auth/user-not-found') {
        return value;
      }
    });
  }),
  check("email").isEmail().withMessage("E-mail is Invalid."),
  check("password").isLength({ min: 8 }).withMessage("Password must 8 or more characters long."),
  check("confirm_password").custom((value, { req, loc, path }) => {    
      if (value !== req.body.password) {
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

router.get('/recovery', (req,res) => {
  res.render('auth/recovery');
});

module.exports = router;