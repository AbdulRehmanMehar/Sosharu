const bcrypt = require('bcryptjs');
const firebase = require('../config/firebase-init');
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const collection = db.collection('users');

let generateID = () => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxx4xxxyxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

let generateToken = () => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};


let getUserByID = (id) => {
  return collection.doc(id).get()
    .then((doc) => {
      if (!doc.exists) {
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
  let $error = 'Credentials are Incorrect.';
  return collection.where('email', '==', email).get()
    .then((snapshot) => {
      if (snapshot.empty) return $error;
      snapshot.docs.forEach(document => {
        if (!document.exists) return $error;
        let user = document.data();
        if (bcrypt.compareSync(password, user.password)) {
          console.log(user);
          return user;
        } else {
          return $error;
        }
      });
    }).catch(err => {
      return err;
    });
};

let createUser = ({ name, email, photo, password, verified }) => {
  let docRef = collection.doc(generateID());
  docRef.set({
    name: name,
    email: email,
    photo: photo || null,
    password: bcrypt.hashSync(password, 10),
    verified: false,
    verficationToken: generateToken(),
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
    }).catch(err => { return Promise.reject(err); });
};

let checkEmailExists = (email) => {
  return collection.where('email', '==', email).get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return email;
      } else {
        return Promise.reject('No user found with this email.');
      }
    }).catch(err => { return Promise.reject(err); });
};

let checkPasswordCorrect = (email, password) => {
  return collection.where('email', '==', email).get()
    .then(snapshot => {
      if (snapshot.empty) throw new Error('Something went wrong.');
      snapshot.docs.forEach(document => {
        if (!document.exists) throw new Error('Something went wrong.');
        let user = document.data();
        if (bcrypt.compareSync(password, user.password)) {
          return password;
        } else {
          throw new Error('Incorrect Password.');
        }
      });
    }).catch(err => { throw new Error(err) });
};

module.exports = {
  getUserByID,
  getByEmailAndPassword,
  createUser,
  checkEmailAvailable,
  checkEmailExists,
  checkPasswordCorrect,
  collection, // Firestore Collection
};
