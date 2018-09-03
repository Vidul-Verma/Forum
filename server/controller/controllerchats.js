const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {generateMsg} = require('.././utils/message');
const jwt  = require('jsonwebtoken');
// const {UserChats} = require('./../models/userchat');
const {User} = require('./../models/user');
const {UserChats} = require('./../models/userchat');
const {ChatRoom} = require('./../models/chatroom');
const {Users} = require('.././utils/users');
const {isRealString} = require('.././utils/validation.js')


var {mongoose} = require('.././db/mongoose');

var {authenticateCookie} = require('.././middleware/authenticateCookie');
var token;
var urlEncodedParser = bodyParser.urlencoded({extended: false});
//CREATE USERS Object for active users array
var users = new Users();

var id;
module.exports = function (app, port, io) {


 io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      token = socket.handshake.query.token;

      next();
    });
  } else {
      next(new Error('Authentication error'));
  }
})
.on('connection', function(socket) {
    // Connection now authenticated to receive further events


    var userChats = new UserChats();
    User.findByToken(token).then((user) =>{
        if(!user){

        }else{



          users.removeUser(socket.id);
          users.addUser(user._id, user.username, socket.id);

          users.getActiveUserNames;
          var currentUser = null;



          socket.on('createMsg', (msg, callback) =>{

             msg.from = user._id;

             var activeUser = users.getUserByName(msg.to);

             if (activeUser){

               io.to(activeUser.socketId).emit('newMsg', generateMsg(user._id, user.username, msg.msg, user.avatar));
               //FIND CHAT ID IN DB AND UPDATE MSG FOR BOTH USERS

               ChatRoom.findOne({
                 $or: [{'userIdOne': user._id, 'userIdTwo': activeUser.userId}, {'userIdOne': activeUser.userId, 'userIdTwo': user._id}]
               }).then((room) =>{

                 if(room.userNameOne == activeUser.userName){
                   if(room.chatDeletedByUserOne == true){
                     console.log('i am in');
                     room.update({$set:{'chatDeletedByUserOne': false}}).then(()=> {return Promise.resolve();});
                     // *********************************//
                     //update the chat id if not present
                     UserChats.update(
                       {userId: activeUser.userId},
                       {$push: {chatIds: {_id: room._id}}}).then((doc) =>
                       {
                         return new Promise.resolve();
                         if(doc){


                         }
                       }).catch((err) =>{

                       });


                      // *********************************//
                   }
                 }else{
                   if(room.userNameTwo == activeUser.userName){
                     if(room.chatDeletedByUserTwo == true){
                       room.update({$set:{'chatDeletedByUserTwo': false}}).then(()=> {return Promise.resolve();});

                       // *********************************//
                       //update the chat id if not present
                       UserChats.update(
                         {userId: activeUser.userId},
                         {$push: {chatIds: {_id: room._id}}}).then((doc) =>
                         {
                           return new Promise.resolve();
                           if(doc){


                           }
                         }).catch((err) =>{

                         });
                        // *********************************//
                     }
                   }
                 }


                   if( room.userIdOne.equals(user._id) ){
                     console.log('Saving ....');
                     room.addMsgFromUserOne(msg.msg, false);
                     // room.saveLastMessageTime();
                   }else{
                     if(room.userIdOne.equals(activeUser.userId)  ){
                        console.log('Saving ....');
                        room.addMsgFromUserTwo(msg.msg, false);
                        // room.saveLastMessageTime();
                     }
                   }




               });


             }else{


                UserChats.findByUserName(msg.to).then((iamuser) =>{
                    var inactiveUser = iamuser;

                    ChatRoom.findOne({$or: [{'userIdOne': user._id, 'userIdTwo': inactiveUser.userId}, {'userIdOne': inactiveUser.userId, 'userIdTwo': user._id}]} )
                    .then((room) =>{

                      if(room.userNameOne == inactiveUser.userName){
                        if(room.chatDeletedByUserOne == true){
                          room.update({$set:{'chatDeletedByUserOne': false}}).then(()=> {return Promise.resolve();});
                          // *********************************//
                          //update the chat id if not present
                          UserChats.update(
                            {userId: inactiveUser.userId},
                            {$push: {chatIds: {_id: room._id}}}).then((doc) =>
                            {
                              return new Promise.resolve();
                              if(doc){


                              }
                            }).catch((err) =>{

                            });
                           // *********************************//
                        }
                      }else{
                        if(room.userNameTwo == inactiveUser.userName){
                          if(room.chatDeletedByUserTwo == true){
                            room.update({$set:{'chatDeletedByUserTwo': false}}).then(()=>{return Promise.resolve();} );
                            // *********************************//
                            //update the chat id if not present
                            UserChats.update(
                              {userId: inactiveUser.userId},
                              {$push: {chatIds: {_id: room._id}}}).then((doc) =>
                              {
                                return new Promise.resolve();
                                if(doc){


                                }
                              }).catch((err) =>{

                              });
                             // *********************************//
                          }
                        }
                      }

                      if( room.userIdOne.equals(user._id) ){
                        UserChats.findOneAndUpdate({'userId': inactiveUser.userId}, {$inc : {'unreadCount' : 1}}).then(() =>{
          								return Promise.resolve();
          							});
                        console.log('Saving ....');
                        room.addMsgFromUserOne(msg.msg, false);
                        // room.saveLastMessageTime();
                      }else{
                        UserChats.findOneAndUpdate({'userId': inactiveUser.userId}, {$inc : {'unreadCount' : 1}}).then(() =>{
          								return Promise.resolve();
          							});
                        if(room.userIdOne.equals(inactiveUser.userId)  ){
                           console.log('Saving ....');
                           room.addMsgFromUserTwo(msg.msg, false);
                           // room.saveLastMessageTime();
                        }
                      }
                    });
                    // UserChats.saveMessage(user._id, inactiveUser.userId, inactiveUser.userName, true, msg.msg, false);
                    // UserChats.saveMessage(inactiveUser.userId, user._id, user.username, false, msg.msg, false);

                })


             }
             callback();
           });

        }

    }).catch((err) => {
        //401 MEANS AUTH IS REQUIRED
        console.log(err);
    });


    socket.on('disconnect', () =>{

         var user =users.removeUser(socket.id);





    });

  });






  app.get('/user/chat', authenticateCookie, (req, res) =>{
      res.render('chat');

  });

  app.get('/chat/me', authenticateCookie, (req, res) =>{

    //CHANGES
    let data = {
      username: req.user.username,
      avatar: req.user.avatar
    }
      res.status(200).json(data);
  });

  app.post('/user/chat', authenticateCookie, (req,res) =>{



    UserChats.findByUserId(req.user._id).then((myData) =>{
        var myChatIds = myData.chatIds;


        ChatRoom.find({'_id': { $in: myChatIds}}, {'userNameOne': 1, 'userNameTwo': 1, 'msg': 1, 'readByUserOne': 1, 'readByUserTwo': 1}).then((chats) =>{
          res.json(chats);
        });


    });

  });



  app.post('/user/chat/read', [authenticateCookie, urlEncodedParser] , (req,res) =>{

    UserChats.findOneAndUpdate({userId: req.user._id}, {unreadCount: 0},{new: true}).then((doc) =>{
      console.log(doc)
      return Promise.resolve();
    });

    User.findByToken(req.token).then((user) =>{
        if(!user){

        }else{

          //SET READ TO TRUE IF REQUEST MADE TO THIS API
            ChatRoom.resetReadMsg(req.user.username, req.body.userName);

        }
        res.sendStatus(200);
      }).catch((err) =>{
        res.sendStatus(401);
      });


  });

  app.post('/user/chat/createchatroom', [authenticateCookie, urlEncodedParser] , (req,res) =>{

    var userChat;
    UserChats.findByUserName(req.body.userName).then((doc) =>{

      if(!doc){
        //SERVICE UNAVAILABLE
        res.sendStatus(503);
        return Promise.reject();

      }
      userChat = doc;
      var emptyArray = [];

      ChatRoom.findOne({
        $or: [{'userNameOne': req.user.username, 'userNameTwo': req.body.userName}, {'userNameOne': req.body.userName, 'userNameTwo': req.user.username}]
      }).then((doc) =>{
        if(!doc){
          //   //CREATE A CHAT ROOM INSIDE THEN CALL
          var lastMsgTime = new Date();
          console.log('********************');
          console.log(req.user.avatar);
          console.log(userChat.avatar);
          console.log('********************');
            var chatRoom = new ChatRoom({userIdOne: req.user._id, userIdTwo: userChat.userId,
              userNameOne: req.user.username, userNameTwo:req.body.userName, avatarUserOne:req.user.avatar, avatarUserTwo: userChat.avatar, msgFromUserOne: emptyArray, msgFromUserTwo: emptyArray, lastMessageTime: lastMsgTime});

            chatRoom.save().then((room) =>{
              var id = room._id;
                //SAVE THE ROOMID TO BOTH THE USERS
                var query1 = UserChats.findByUserId(req.user._id).then((chat) =>{

                  chat.chatIds.push(id);
                  chat.save();


                }).catch((error) =>{
                  console.log('error in saving chatid to user doc ' + error);
                });

                var query2 = UserChats.findByUserId(userChat.userId).then((chat) =>{


                  chat.chatIds.push(id);
                  chat.save();
                }).catch((error) =>{
                  console.log('error in saving chatid to user doc ' + error);
                });


            Promise.all([query1,query2]).then(res.json(chatRoom)).catch((err) => console.log(err));


            });

        }else{


          UserChats.update(
            {userId: req.user._id},
            {$push: {chatIds: {_id: doc._id}}}).then((result) =>
            {
              if(result){
                res.json(doc);
                return new Promise.resolve();
              }
            }).catch((err) =>{

            });

            UserChats.update(
              {userId: userChat.userId},
              {$push: {chatIds: {_id: doc._id}}}).then((result) =>
              {
                if(result){
                  res.json(doc);
                  return new Promise.resolve();
                }
              }).catch((err) =>{

              });


        }
        return Promise.resolve();
      })
    //   //CREATE A CHAT ROOM INSIDE THEN CALL
    //   var chatRoom = new ChatRoom({userIdOne: req.user._id, userIdTwo: userChat.userId,
    //     userNameOne: req.user.username, userNameTwo:req.body.userName, msgFromUserOne: emptyArray, msgFromUserTwo: emptyArray});
    //
    //   chatRoom.save().then((room) =>{
    //
    //     var id = room._id;
    //
    //
    //       //SAVE THE ROOMID TO BOTH THE USERS
    //       UserChats.findByUserId(req.user._id).then((chat) =>{
    //
    //         chat.chatIds.push(id);
    //         chat.save();
    //
    //
    //       }).catch((error) =>{
    //
    //       });
    //
    //       UserChats.findByUserId(userChat.userId).then((chat) =>{
    //
    //
    //         chat.chatIds.push(id);
    //         chat.save();
    //       }).catch((error) =>{
    //
    //       });
    //
    //       res.sendStatus(200);
    //
    //
    //
    //   }).catch((error) =>{
    //     res.sendStatus(404);
    //
    //   });
    //
    // }).catch((err) =>{
    //   if(err){
    //     console.log('user could not be created');
    //   }
    }).catch((err) =>{
      if(err){
        console.log('user could not be created');
        res.sendStatus(503);
      }
    });

});

app.post('/user/chat/chatnames', [authenticateCookie, urlEncodedParser] , (req,res) =>{

      UserChats.findByUserId(req.user._id).then((myData) =>{
      var myChatIds = myData.chatIds;


      ChatRoom.find({'_id': { $in: myChatIds}}, {'_id': 0, 'userNameOne': 1, 'userNameTwo': 1, 'readByUserOne': 1, 'readByUserTwo': 1, 'lastMessageTime': 1, 'avatarUserOne': 1, 'avatarUserTwo': 1}).sort({lastMessageTime: 'desc'}).then((chats) =>{
        res.json(chats);
      });

    });

});

app.post('/user/chat/personalmessages', [authenticateCookie, urlEncodedParser] , (req,res) =>{

      var forUserName = req.body.userName;
      console.log(forUserName);
      UserChats.findByUserId(req.user._id).then((myData) =>{
      var myChatIds = myData.chatIds;


      ChatRoom.find({$or: [{'_id': { $in: myChatIds}, 'userNameOne': req.user.username, 'userNameTwo': req.body.userName}, {'_id': { $in: myChatIds}, 'userNameOne': req.body.userName, 'userNameTwo':  req.user.username}]}, {'userNameOne': 1, 'userNameTwo': 1, 'msg': 1, 'readByUserOne': 1, 'readByUserTwo': 1}).then((chats) =>{
        if(chats[0].userNameOne == req.user.username){
          chats[0].msg = chats[0].msg.filter((msg)=>{
            return !msg.deletedByUserOne;
          });
        }else{
          if(chats[0].userNameTwo == req.user.username){
            chats[0].msg = chats[0].msg.filter((msg)=>{
              return !msg.deletedByUserTwo;
            });
          }
        }
        //TEMPORARY FIX FOR FRONT END ARRAY REQ
        var arr = [];
        arr.push(chats[0]);
        res.json(arr);
      });

    });

});


app.post('/user/chat/deleteindividualmessage', [authenticateCookie, urlEncodedParser] , (req,res) =>{

    UserChats.findByUserId(req.user._id).then((myData) =>{
      var myChatIds = myData.chatIds;
      //CHECK AND UPDATE FOR USERNAME ONE
      ChatRoom.update({'_id': { $in: myChatIds}, 'userNameOne': req.user.username, 'msg._id': req.body.msgId},
      {$set:{"msg.$.deletedByUserOne": true}},
      {upsert:true}).then((chats) =>{
        res.sendStatus(200);
      }).catch((err) =>{

      });
      //CHECK AND UPDATE FOR USERNAME TWO
      ChatRoom.update({'_id': { $in: myChatIds}, 'userNameTwo': req.user.username, 'msg._id': req.body.msgId},
      {$set:{"msg.$.deletedByUserTwo": true}},
      {upsert:true}).then((chats) =>{
        res.sendStatus(200);
      }).catch((err) =>{

      });


    }).catch((err)=>{console.log(err);});



});

app.post('/api/deleteallmessages', [authenticateCookie, urlEncodedParser] , (req,res) =>{

    UserChats.findByUserId(req.user._id).then((myData) =>{


      ChatRoom.findOneAndUpdate({'userNameOne':req.user.username,'userNameTwo':req.body.remoteUsername},
      {$set: {"msg.$[].deletedByUserOne": true, "chatDeletedByUserOne": true} },
      {multi:true, arrayFilters:[]}).then((doc) => {
        console.log(doc._id);
        UserChats.update({userId: req.user._id}, {$pull: {
                chatIds: {
                    _id: doc._id
                }
            }
        },{ safe: true }).then(() =>{
            res.sendStatus(200);
          new Promise.resolve();
        }).catch(()=>{});

      }).catch((err) => {});


        ChatRoom.findOneAndUpdate({'userNameTwo':req.user.username,'userNameOne':req.body.remoteUsername},
        {$set: {"msg.$[].deletedByUserTwo": true, "chatDeletedByUserTwo": true} },
        {multi:true, arrayFilters:[]}).then((doc) => {

          UserChats.update({userId: req.user._id}, {$pull: {
                  chatIds: {
                      _id: doc._id
                  }
              }
          }).then(() =>{
              res.sendStatus(200);
            return new Promise.resolve();

          }).catch((err) =>{

          });

        }).catch((err) => {});

    }).catch((err)=>{console.log(err);});
});


}
