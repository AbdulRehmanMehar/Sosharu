const bcrypt = require('bcryptjs');
const firebase = require('../config/firebase-init');
const mailer = require('../config/nodemailer');
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const collection = db.collection('users');

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


let getUserByID = (id) => { // Returns Promise
  return new Promise((resolve, reject) => {
    return collection.doc(id).get()
      .then((doc) => {
        if (!doc.exists) {
          reject("User not Found");
          // return false;
        }
        resolve(doc.data());
        // return doc.data();
      }).catch((err) => {
        reject("Unexpected Error Occured");
        // return false;
      });
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

let createUser = (obj) => {
  let { name, email, photo, password, verified = false } = obj;
  return collection.add({
    name: name,
    email: email,
    photo: photo || null,
    password: bcrypt.hashSync(password, 10),
    verified: verified,
    verficationToken: (verified) ? '' : generateToken(),
    createdAt: Date.now()
  }).then(docRef => {
    if(!verified)
      return getUserByID(docRef.id)
        .then(user => {
          mailer.send(
            user.email, 
            'Registeration is Complete', 
            'verification', 
            { 
              name: user.name, 
              docId: docRef.id, 
              verificationToken: user.verficationToken,
              info: 'login=true&redirect=upload-photo'
            }
          );
        })
        .catch(error => console.log(error)); 
  }).catch(error => console.log(error));
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

let updateUser = (id, obj) => {
  let {name_, email_, photo_, password_, verified_} = obj;
  return new Promise((resolve, reject) => {
    return getUserByID(id)
      .then(user => {
        let { name, email, photo, password, verified, verficationToken } = user;
        let update = {
          name: (name_ == name || name_ == null) ? name : name_,
          email: (email_ == email || email_ == null) ? email : email_,
          photo: (photo_ == photo || photo_ == null) ? photo : photo_,
          password: (bcrypt.compareSync(password_ || '', password) || password_ == null) ? password : bcrypt.hashSync(password_),
          verified: (verified_ == verified || verified_ == null) ? verified : verified_,
          verficationToken: (verified_ == verified || verified_ == null) ? verficationToken : '',
        };
        return collection.doc(id).update(update)
          .then(() => {
            return getUserByID(id)
              .then(newuser => resolve(newuser)) // Resolve new User with updated data
              .catch(err => reject(err));
          }).catch(err => reject(err));
      }).catch(err => reject(err));
  });
};

module.exports = {
  getUserByID,
  getByEmailAndPassword,
  createUser,
  checkEmailAvailable,
  checkEmailExists,
  checkPasswordCorrect,
  updateUser,
  collection, // Firestore Collection
};
