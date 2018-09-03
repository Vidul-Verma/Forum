const {User} = require('./../models/user');

var loggedInCheck = (req, res, next) =>{
    var token = req.cookies['x-auth'];
    console.log(token)
    User.findByToken(token).then((user) =>{
        if(user){
            // res.redirect('/user/chat').send();
            res.redirect('/forum');
        } else {
            next();
        }
    }).catch(() => next());
}

module.exports = {
    loggedInCheck
};
