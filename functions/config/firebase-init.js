const functions = require('firebase-functions');
const admin = require("firebase-admin");

const firebase = admin.initializeApp(functions.config().firebase);

module.exports = firebase;