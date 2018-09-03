const {User} = require('./../models/user');

var returnAdminOrNot = (req, res, next) =>{
        //GET THE AUTH TOKEN FROM THE REQ
    var token = req.cookies['x-auth'] ;
    //STATICS MODEL METHOD TO GET THE USER WITH THE TOKEN
    User.findByToken(token).then((user) =>{
        if(!user || !user.admin){
            //THERE IS A VALID TOKEN BY QUERY CANNOT FIND THE USER
            //CAN ALSO SEND RES.STATUS(401).SEND()
            req.admin = false;
        }else{
          if(user.admin){
            req.admin = true;
          }
        }
        next();
    }).catch(() => {
        //401 MEANS AUTH IS REQUIRED
        res.sendStatus(200);
    });
}

module.exports = {
    returnAdminOrNot
};
