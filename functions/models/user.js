const bcrypt = require('bcryptjs');
const firebase = require('../config/firebase-init');
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const collection = db.collection('users');

let getUserByID = (id) => {
    collection.doc(id).get()
    .then((doc) => {
      if(!doc.exists){
        console.log('No User with id', id);
        return false;
      }
      console.log('User found', doc.data());
      return doc.data();
    }).catch((err) => {
      console.log('Error Occurd while getting user with id', id);
      return false;
    });
};

let getByEmailAndPassword = (email, password) => {
  return collection.where('email', '==', email).get()
    .then((snapshot) => {
      if(snapshot.empty) return Promise.reject('User doesn\'t Exists.');
      snapshot.docs.forEach(document => {
        if (!document.exists) return Promise.reject('User doesn\'t Exists.');
        console.log(document.data());
        return document.data();
      });
    });
};

let createUser = ({id, name, email, photo, password, verified}) => {
  let docRef = collection.doc(id);
  docRef.set({
    name: name,
    email: email,
    photo: photo || null,
    password: bcrypt.hashSync(password, 10),
    verified: verified,
    verficationToken: verficationToken,
    createdAt: Date.now()
  });
};

// A method for validation which returns promise or email
let checkEmailAvailable = (email) => {
  return collection.where('email', '==', email).get()
    .then(snapshot => {
      if (!snapshot.empty) return Promise.reject("Email already in use.");
      snapshot.docs.forEach(document => {
        if (!document.exists) { 
          return email;
        } else {
          return Promise.reject("Email already in use.");
        }
      });
    }).catch(err => {return Promise.reject(err);});
};

let checkEmailExists = (email) => { 
  return collection.where('email', '==', email).get()
    .then(snapshot => {
      if(!snapshot.empty){
        return email;
      }else{
        return Promise.reject('No user found with this email.');
      }
    }).catch(err => {return Promise.reject(err);});
};

module.exports = {
  getUserByID, // Method
  createUser, // Method
  checkEmailAvailable,
  checkEmailExists, // Method
  collection, // Firestore Collection
};
