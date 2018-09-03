const {User} = require('./../models/user');

var authenticate = (req, res, next) =>{
        //GET THE AUTH TOKEN FROM THE REQ
    var token = req.header('x-auth') ;
    //STATICS MODEL METHOD TO GET THE USER WITH THE TOKEN
    User.findByToken(token).then((user) =>{
        if(!user){
            //THERE IS A VALID TOKEN BY QUERY CANNOT FIND THE USER
            //CAN ALSO SEND RES.STATUS(401).SEND()
            return Promise.reject();
        }

        req.token = token;
        req.user = user;
        next();
    }).catch(() => {
        //401 MEANS AUTH IS REQUIRED
        res.status(401).send();
    });
}

module.exports = {
    authenticate
};
