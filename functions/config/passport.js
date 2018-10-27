const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const keys = require('./keys');

let getImg4mGp = (urI) => { // Get Full Size Image From G+
  return urI.replace(/sz=50/, '');
};


let handleSocialCallBack = (accessToken, refreshToken, profile, done) => {
  console.log(profile);
};

/*
---------- serialize & deserialize process
*/

passport.serializeUser((user, done) => {
  console.log('Passport Serialize', user.email);
  return done(null, user.email);
});

passport.deserializeUser((email, done) => {
  console.log('Passport Deserialize', email);
  return User.getByEmail(email)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});
/*
---------- Local Strategy
*/

passport.use('local', new LocalStrategy({
  usernameField: 'l_email',
  passwordField: 'l_pwd',
  passReqToCallback: true
}, (req, username, password, done) => {
  return User.getByEmailAndPassword(username, password)
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }).catch(err => done(err, null));
}));

/*
---------- Facebook Strategy
*/

passport.use(new FacebookStrategy({
  clientID: keys.facebook.clientID,
  clientSecret: keys.facebook.clientSecret,
  callbackURL: keys.facebook.callbackURL,
  passReqToCallback: true
}, (accessToken, refreshToken, profile, done) => { 
  handleSocialCallBack(accessToken, refreshToken, profile, done); 
}));

/*
---------- Google plus Strategy
*/

passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: keys.google.callbackURL
}, (accessToken, refreshToken, profile, done) => {
  handleSocialCallBack(accessToken, refreshToken, profile, done);
}));

