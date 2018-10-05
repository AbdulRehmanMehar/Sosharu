const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const keys = require('./keys');

let getImg4mGp = (urI) => { // Get Full Size Image From G+
  return urI.replace(/sz=50/, '');
};


/*
---------- serialize & deserialize process
*/

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

/*
---------- Facebook Strategy
*/

passport.use(new FacebookStrategy({
  clientID: keys.facebook.clientID,
  clientSecret: keys.facebook.clientSecret,
  callbackURL: keys.facebook.callbackURL
}, (accessToken, refreshToken, profile, done) => {
  
}));

/*
---------- Google plus Strategy
*/

passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: keys.google.callbackURL
}, (accessToken, refreshToken, profile, done) => {
  
}));
