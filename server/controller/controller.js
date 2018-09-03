const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const multer = require('multer');
const path = require('path');
var fs = require('fs');

//USER ROUTER FOR SPECIFIC ROUTES
const router = express.Router();

//CREATE A MONGOOSE,USER OBJ
var {mongoose} = require('.././db/mongoose');
var {User} = require('.././models/user');
var {authenticate} = require('.././middleware/authenticate');
var {returnAdminOrNot} = require('.././middleware/returnAdminOrNot');
var {authenticateCookie} = require('.././middleware/authenticateCookie');
var {authenticateAdmin} = require('.././middleware/authenticateAdmin');
var {authenticateCookieAndPublic} = require('.././middleware/authenticateCookieAndPublic');
var {loggedInCheck} = require('.././middleware/loggedInCheck');
const bcrypt = require('bcrypt');
const {UserChats} = require('./../models/userchat');
const {ChatRoom} = require('./../models/chatroom');
const {Thread} = require('./../models/thread');
const {Reply} = require('./../models/reply');
const {ContactMessage} = require('./../models/contactmessage');
const {BlogComments} = require('./../models/blogcomments');
const {emailTransporter} = require('.././utils/email');

const avatarUploadPath = path.join(__dirname + '/../public/uploads');

const storage = multer.diskStorage({
  destination: avatarUploadPath,
  filename: function(req, file, cb) {
    cb(null,Date.now() + randomString(10) + path.extname(file.originalname));
  }
});

function randomString(length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file,cb)
  }
}).single("myimage")

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|svg/;
  const extnamePass = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypePass = filetypes.test(file.mimetype);

  if (extnamePass && mimetypePass) {
    cb(null, true);
  } else {
    cb("noimage");
  }
}

var urlEncodedParser = bodyParser.urlencoded({extended: false});
const cookieParser = require('cookie-parser');

router.use(cookieParser());


//ACCESS THE MIDDLEWARE
router.use(bodyParser.json());




    //RENDER PAGES
router.get('/login',loggedInCheck,(req, res) =>{
  res.render("login",{});
})

router.get('/',loggedInCheck,(req, res) =>{
  res.render("forumindex",{});
})

router.get('/website',(req, res) =>{
  res.render("website");
})

router.post("/api/createcontactmsg", urlEncodedParser, (req, res) => {


  let newMessage = new ContactMessage({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    gre: req.body.grescore,
    toefl: req.body.toeflscore,
    ielts: req.body.ieltsscore,
    cgpa: req.body.cgpascore,
    phone: req.body.phonenumber
  });

  newMessage.save().then((doc) => {
    console.log(doc)
    res.sendStatus(200);
  }).catch((err) => {
    res.sendStatus(500);
    console.log(err);
  })

});

router.post("/api/changeusertype", authenticateAdmin, (req,res) => {

  if (!allowedUserTypes.includes(req.body.type)) {
    res.sendStatus(400);
  } else {
    User.update({
      username: {
        $in: req.body.users
      }
    },{
      typeOfUser: req.body.type
    },{
      multi: true
    }).then((result) => {
      console.log(result);
      res.sendStatus(200);
    })
  }
});

router.get("/api/getusers/:type", authenticateAdmin, (req, res) => {
  User.find({
    typeOfUser: req.params.type
  }).then((users) => {
    res.send(users);
  });
})

router.post("/api/admin/blockuser/:username", authenticateAdmin, (req,res) => {
  User.findOneAndUpdate({'username': req.params.username}, {'blocked': true, '$set': {'tokens': []}}).then((doc) =>{
    res.sendStatus(200);
    return Promise.resolve();
  }).catch((err) =>{
    res.sendStatus(500);
  })
});

router.post("/api/admin/unblockuser/:username", authenticateAdmin, (req,res) => {
  User.findOneAndUpdate({'username': req.params.username}, {'blocked': false}).then((doc) =>{
    res.sendStatus(200);
    return Promise.resolve();
  }).catch((err) =>{
    res.sendStatus(500);
  })
});


router.get("/api/getreadcontactmsg", authenticateAdmin, (req, res) => {
    ContactMessage.find({
      readByAdmin: true
    },{
      __v: 0
    }).then((messages) => {
      res.send(messages);
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err);
    })
});

router.get("/api/getunreadcontactmsg", authenticateAdmin, (req, res) => {
    ContactMessage.find({
      readByAdmin: false
    },{
      __v: 0
    }).then((messages) => {
      res.send(messages);
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err);
    })
});

router.post("/api/markcontactmsg", authenticateAdmin, (req, res) => {
    ContactMessage.findOneAndUpdate({
      _id: req.body.messageId
    },{
      readByAdmin: req.body.readByAdmin
    },{
      new: true
    }).then((message) => {
      console.log(message)
      res.sendStatus(200);
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err);
    })
});

router.post("/api/admin/deletecontactmessage", authenticateAdmin, (req, res) => {
    ContactMessage.findOne({
      _id: req.body.messageId
    }).remove().then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err);
    })
});

router.get('/profile', (req, res) => {
    res.render("profile");
});

router.get('/profile/:username', authenticateCookieAndPublic, (req, res) =>{


  User.findOne({'username': req.params.username}, {'_id':0, 'tokens':0, '__v':0}).then((user) =>{
    let data ;
    if (!req.user) {
      let resUser = user.toObject();
      delete resUser.email;
      data = {
        user: resUser,
        isItMe: false
      }
    } else {
      if(req.user.username == req.params.username){
        data = {
          user: user.toObject(),
          isItMe: true
        }
      }else{
        let resUser = user.toObject();
        delete resUser.email;
        data = {
          user: resUser,
          isItMe: false
        }
      }
    }
    res.json(data);
    return Promise.resolve();
  }).catch((err)=>{
    console.log(err);
  })
})



// router.get('/profileof/:username', (req, res) =>{

//   User.findOne({'username': req.params.username}, {'_id':0, 'tokens':0, '__v':0}).then((user) =>{
//     res.json(user.toObject());
//     return Promise.resolve();
//   }).catch((err)=>{
//     console.log(err);
//   })
// })

router.post('/profile/save', [authenticateCookie,urlEncodedParser], (req, res) =>{
  console.log(req.body);
  User.update({'_id': req.user._id}, {
    fullName: req.body.myFullName,
    about: req.body.aboutMe,
    location: req.body.myLocation,
    university: req.body.myUniversity,
    major: req.body.myMajor,
    specialisation: req.body.mySpecialisation
  }).then(() =>{
    res.sendStatus(200);
    return Promise.resolve();
  }).catch(()=>{
    return Promise.reject();
  })
})

router.get("/avatarupload", authenticateCookie, (req, res) => {
  res.render("avatarupload");
})

router.post("/avatarupload", authenticateCookie, (req, res) => {
  let pathToDelete;
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400);
      if (err === "noimage") {
        res.send("File was not an image");
      } else {
        res.send("ERROR");
      }
    } else {

      // console.log(req.file);
      User.findOneAndUpdate({
        _id: req.user._id
      },{
        avatar: req.file.filename
      }).then((doc) => {
        if(doc.avatar){
          pathToDelete = avatarUploadPath + '/' + doc.avatar;
          fs.unlink(pathToDelete);
        }

        res.sendStatus(200);
        return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      Thread.update({
        'creatorId': req.user._id
      },{
        avatar: req.file.filename
      }, {multi: true}).then((doc) => {

        return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      Reply.update({
        'creatorId': req.user._id
      },{
        avatar: req.file.filename
      }, {multi: true}).then((doc) => {

        return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      BlogComments.update({
        'creatorId': req.user._id
      },{
        avatar: req.file.filename
      }, {multi: true}).then((doc) => {

        return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      UserChats.update({
        'userId': req.user._id
      },{
        avatar: req.file.filename
      }, {multi: true}).then((doc) => {

        return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      ChatRoom.update({
        'userIdOne': req.user._id
      },{
        avatarUserOne: req.file.filename
      },{
        multi: true
      }).then((room) => {
          return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });

      ChatRoom.update({
        'userIdTwo': req.user._id
      },{
        avatarUserTwo: req.file.filename
      },{
        multi: true
      }).then((room) => {
          return Promise.resolve();
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });


    }
  })
})

//RENDER PAGES
// router.get('/user/chat',(req, res) =>{
// res.render("chat");
// })

// router.get('/user/joingroup',(req, res) =>{
//   res.render("joingroup",{});
// })

//USER SCHEMA
router.post('/users', urlEncodedParser, (req, res) =>{

  var body = _.pick(req.body, ['username', 'email', 'password']);

  body.activationKey = randomString(30) + Date.now();
  body.avatar = 'avatar.png';
  console.log('**********'+ body.email);
  User.findOne({'username': body.username}).then((doc) =>{
    if(doc && !doc.active){
      doc.email = body.email;
      doc.password = body.password;
      doc.save().then(()=>{
          let message = {
              from: 'UnimantraNetwork <noreply.forum@unimantra.com>',
              to: `<${body.email}>`,
              subject: 'Activate your UnimantraNetwork account',
              text: 'Hello, Thank you for creating UnimantraNetwork account. Please click on https://forum.unimantra.com/activateuser?a='+ doc.activationKey +' to activate your account. Thanking you, UnimantraNetwork Team',
              html: '<p>Hello,<br> Thank you for creating UnimantraNetwork account. Please click on following link to activate your account.<br><br><a href="https://forum.unimantra.com/activateuser?a='+doc.activationKey+'">Activate account<a/><br><br> Thanking you,<br> UnimantraNetwork Team</p>'
          };
          emailTransporter.sendMail(message, (err, info) => {

              if (err) {
                  console.log('Email: Error occurred. ' + err.message);
                  return process.exit(1);
              }

              console.log('Email: Message sent: %s', info.messageId);
          });
          res.sendStatus(200);
          return Promise.resolve();
      }).catch((err) =>{
        console.log(err);
      })
    }else if(doc && doc.active){

      res.sendStatus(400);
    }else{

          //PICK ONLY EMAIL AND PASSWORD FROM THE REQ SINCE REST ARE NOT MODIFIABLE BY USER

          var newUser = new User(body);
          console.log('*****' + doc);

          newUser.save().then((doc) =>{
            if(doc){
              // SEND ACCOUNT ACTIVATION EMAIL
                let message = {
                    from: 'UnimantraNetwork <noreply.forum@unimantra.com>',
                    to: `<${body.email}>`,
                    subject: 'Activate your UnimantraNetwork account',
                    text: 'Hello, Thank you for creating UnimantraNetwork account. Please click on https://forum.unimantra.com/activateuser?a='+ doc.activationKey +' to activate your account. Thanking you, UnimantraNetwork Team',
                    html: '<p>Hello,<br> Thank you for creating UnimantraNetwork account. Please click on following link to activate your account.<br><br><a href="https://forum.unimantra.com/activateuser?a='+body.activationKey+'">Activate account<a/><br><br> Thanking you,<br> UnimantraNetwork Team</p>'
                };

                emailTransporter.sendMail(message, (err, info) => {

                    if (err) {
                        console.log('Email: Error occurred. ' + err.message);
                        return process.exit(1);
                    }

                    console.log('Email: Message sent: %s', info.messageId);
                });

                var emptyArray = [];
                var userChats = new UserChats({userId: doc._id, userName: doc.username, chatIds: emptyArray});

                userChats.save().then(() =>{
                  console.log('user saved');
                }).catch((error) =>{
                    console.log(error);
                });

            }

              res.sendStatus(200);
              return Promise.resolve();
          }).catch((error) =>{

              res.status(400).send(error);

          });


    }
    return Promise.resolve();
}).catch(() =>{
  console.log(err);
});
});

router.get('/activateuser', (req, res) => {
    res.render("useractivation");
});

router.get('/activateuser/:activationKey', (req, res) => {
    User.findOneAndUpdate({
        activationKey: req.params.activationKey
    },{
        $unset: {
            activationKey: 1
        },
        active: true
    }).then((result) => {
        console.log(result);
        if (!result) {
            res.json({
                result: "INVALID_KEY"
            });
        } else {
            res.json({
                result: "SUCCESS"
            });
        }
    }).catch((result) => {
        console.log(result);
        res.sendStatus(500);
    })
});


//CREATE PRIVATE ROUTE
//WITH AUTH
router.get('/users/me', authenticateCookie, (req, res) =>{
   //THIS CODE WILL GO INTO THE MIDDLEWARE
//    //GET THE AUTH TOKEN FROM THE REQ
//    var token = req.header('x-auth');
//    //STATICS MODEL METHOD TO GET THE USER WITH THE TOKEN
//    User.findByToken(token).then((user) =>{
//        if(!user){
//            //THERE IS A VALID TOKEN BY QUERY CANNOT FIND THE USER
//            //CAN ALSO SEND RES.STATUS(401).SEND()
//            return Promise.reject();
//        }
//        res.status(200).send(user);
//    }).catch(() => {
//        //401 MEANS AUTH IS REQUIRED
//        res.status(401).send();
//    });

    res.status(200).send(req.user);
});

//LOGIN USER
router.post('/users/login', urlEncodedParser, (req, res) =>{

    var body = _.pick(req.body, ['username','email', 'password']);

    console.log('LOGIN API OUTOUT:');
    console.log(body);

    //CALL THE MODEL METHOD
    var usernameOrEmail;
    if (body.email) {
        usernameOrEmail = body.email;
    } else if (body.username){
        usernameOrEmail = body.username;
    }

    User.findByCredentials(usernameOrEmail, body.password).then((user) =>{

        if (!user.active || user.blocked) {
          if(!user.active){
            res.status(401).send('inactive');
          }
          if(user.blocked){
            res.status(401).send('blocked');
          }

        } else {

            if(user.admin){
              return user.generateAuthToken().then((token) =>{
                  res.header('x-auth', token).header('a-auth', '1011').send(user.username);
              });
            }else{
              return user.generateAuthToken().then((token) =>{
                  res.header('x-auth', token).header('a-auth', '1010').send(user.username);
              });
            }

        }

    }).catch((err) =>{
        res.sendStatus(400);
        console.log(err);
    });

});


//LOGOUT USER
router.delete('/api/logout', authenticateCookie,  (req, res) =>{
    req.user.removeToken(req.token).then(() =>{
       res.status(200)
       res.clearCookie('x-auth')
       res.clearCookie('u-auth')
       res.clearCookie('a-auth')
       res.clearCookie('io')
       // res.redirect('/')
       res.send();
    }, () =>{
        res.sendStatus(400).send();
    });
});

router.get('/api/getavatar',authenticateCookie, (req, res) =>{
  User.findOne({'_id': req.user._id}).then((doc) =>{
    res.json(doc.avatar);
    return Promise.resolve();
  }).catch((err) =>{
    console.log(err);
  })
})

router.get('/api/getadmin',returnAdminOrNot, (req, res) =>{

  let data;
  if(req.admin){
    data = {
      admin: true
    }
  }else{
    data = {
      admin: false
    }
  }
  res.json(data);
})

router.get("/passwordreset",(req,res) => {
    res.render("passwordreset");
})

router.get("/createnewpassword",(req,res) => {
    res.render("createnewpassword");
})

router.post("/api/requestpasswordreset", urlEncodedParser, (req,res) => {
    console.log(req.body)
    User.findOne({
        email: req.body.email
    }).then((user) => {
        console.log(user);
        if (!user) {
            console.log("PASSWORD RESET: USER NOT FOUND");
            res.json({
                result: "NO_ACCOUNT"
            });
            return Promise.resolve();
        }
        let passwordResetKey = randomString(30) + Date.now();
        user.passwordResetKey = passwordResetKey;
        user.save().then((result) => {

            let message = {
                from: 'UnimantraNetwork <noreply.forum@unimantra.com>',
                to: `<${user.email}>`,
                subject: 'Password Reset',
                text: 'Hello, Please click on following link to generate new password. https://forum.unimantra.com/createnewpassword?k='+ passwordResetKey +'  If you have not requested this password reset, just ignore this email. Thanking you, UnimantraNetwork Team',
                html: '<p>Hello,<br> Please click on following link to generate a new password.<br><br><a href="https://forum.unimantra.com/createnewpassword?k='+ passwordResetKey +'">RESET PASSWORD<a/><br><br>If you have not requested this password reset, just ignore this email.<br> Thanking you,<br> UnimantraNetwork Team</p>'
            };
            emailTransporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Email: Error occurred. ' + err.message);
                    return process.exit(1);
                } else {
                    console.log('Email: Message sent: %s', info.messageId);
                    res.json({
                        result: "SUCCESS"
                    });
                    return Promise.resolve();
                }
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });

        return Promise.resolve();
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.post("/api/passwordreset", urlEncodedParser, (req,res) => {
    console.log(req.body);
    User.findOne({
        passwordResetKey: req.body.key
    }).then((user) => {
        if (!user) {
            console.log("CREATE NEW PASSWORD: INVALID RESET KEY")
            res.json({
                result: "INVALID_KEY"
            });
            return Promise.resolve();
        }
        user.password = req.body.password;
        user.passwordResetKey = null;
        user.save().then((result) => {
            console.log(user);
            console.log(result);
            res.json({
                result: "SUCCESS"
            });
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
        return Promise.resolve();
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });

});

router.post("/api/changepassword", authenticateCookie, (req,res) => {
  let user = req.user;
  bcrypt.compare(req.body.oldpassword, user.password, (err, result) =>{
      
      if(result){
      
          user.password = req.body.newpassword;
          user.save().then((doc) =>{
      
            res.sendStatus(200);
      
          }).catch((err) =>{
            console.log(err)
            res.sendStatus(401)
          })
      
      }else{
          res.sendStatus(401);
      }
      
    });
});

module.exports = router;
