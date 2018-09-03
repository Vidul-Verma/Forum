const {User} = require('./../models/user');

var authenticateCookieAndPublic = (req, res, next) =>{
    var token = req.cookies['x-auth'];

    if (!token) {
        req.loggedIn = false;
        next();
    } else {

        User.findByToken(token).then((user) =>{

            if (user){
                req.loggedIn = true;
                req.token = token;
                req.user = user;
                next();
            } else {
                req.loggedIn = false;
                next();
            }
            console.log(user)
        }).catch((err) => {
            req.loggedIn = false;
            next();
            console.log(err)
        });

    }
}

module.exports = {
    authenticateCookieAndPublic
};
