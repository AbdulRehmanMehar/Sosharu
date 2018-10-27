const User = require('../models/user');

module.exports = (req, res, next) => {
    if (req.query.redirect) {
        res.redirect(req.query.redirect);
        return next();
    } else if (req.query.login) {
        credentials = req.query.login.split(":");
        let docId = credentials[0];
        let verifyToken = credentials[1];
        return User.getUserByID(docId)
            .then((user) => {
                if (verifyToken === user.verficationToken){
                    return User.updateUser(docId, { verified_: true })
                        .then(newUser => {
                            console.log(newUser);
                            return next();
                        }).catch(err => {
                            console.log('updateUser catch', err);
                            return next();
                        });
                }else{
                    console.log('Invalid DocId or VerificationToken');
                    return next();
                }
            }).catch(err => {
                console.log('getUserByID catch', err);
                return next();
            });
    }else{
        next();
    }
    
};