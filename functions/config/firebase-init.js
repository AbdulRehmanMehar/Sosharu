const functions = require('firebase-functions');
const admin = require("firebase-admin");

const serviceAccount = require("./social-57b13-firebase-adminsdk-shwlp-c0d13ebbec.json");


// const firebase = admin.initializeApp(functions.config().firebase);
const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-57b13.firebaseio.com"
});

module.exports = firebase;