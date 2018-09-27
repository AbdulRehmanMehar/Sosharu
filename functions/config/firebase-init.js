const admin = require("firebase-admin");
const serviceAccount = require("./firebase.json");

const firebase = admin.initializeApp({
  serviceAccount: serviceAccount,
  databaseURL: "https://social-57b13.firebaseio.com"
});

module.exports = firebase;