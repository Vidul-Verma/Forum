const mongoose = require('mongoose');
const _ = require('lodash');
var moment = require('moment');

//CREATE A SCHEMA
var UserChatSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
  },
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    avatar:{
      type: String,
      default: null
    },
    unreadCount:{
      type: Number,
      default: 0
    },
    // msg:[{
    //   withUserId:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     reqired: false
    //   },
    //   withUserName:{
    //     type: String,
    //     reqired: false
    //   },
    //   //TRUE FOR SENT FALSE FOR RECEIVED
    //   direction:{
    //     type: Boolean,
    //     required: false
    //   },
    //   msg:{
    //     type: String,
    //     reqired: false
    //   },
    //   createdAt:{
    //     type : Date,
    //     default: Date.now,
    //     reqired: false
    //
    //   },
    //   read: {
    //     type: Boolean,
    //     default: false
    //   }
    // }],
    chatIds: [{
      chatId:{
         type: mongoose.Schema.Types.ObjectId
      }
    }]
});

UserChatSchema.methods.removeChatId = function(id){

    var userChat = this;
    return userChat.update({
        //PULL LETS YOU REMOVE ITEMS FROM THE ARRAY WHICH MATCH A CERTAIN CRITERIA
        $pull: {
            chatIds: {
                chatId: id
            }
        }
    });

};

UserChatSchema.methods.addChatId = function(id){

    var userChat = this;
    userChat.chatIds = userChat.chatIds.concat([{id}]);
    userChat.save().then((err, doc) =>{
        console.log('chatId saved' + doc);
    })

};


// UserChatSchema.statics.saveMessage = function(myId, userId, userName, direction, message, read){
//     var createdAt =  moment().valueOf();
//     var UserChats = this;
//
//     var msgNew = {
//         withUserId: userId,
//         withUserName: userName,
//         direction: direction,
//         msg: message,
//         createdAt: createdAt,
//         read: read
//       };
//
//     UserChats.findOneAndUpdate({"userId": myId}, {
//       "$push":{
//       "msg": msgNew
//     },
//     "$addToSet":{
//       "allContactedUsers": userName
//     }
//     }, function(err){
//       if(err){
//           console.log(err);
//       }
//
//     });
//
//
// }

// UserChatSchema.statics.saveReadMessages = function(myId, userName, read){
//   var UserChats = this;
//
//   console.log(myId.typeof());
//   console.log('trying to find for many ' + userName+ ' ****' + read);
//   // UserChats.findOneAndUpdate({"userId": myId, "msg.withUserName": userName}, {
//   //   "$set": {
//   //     "msg.$.read": read
//   //   }
//   // }, function(err, doc) {
//   //   if(err){
//   //     console.log(err);
//   //   }else{
//   //     console.log(doc.msg);
//   //   }
//   //
//   //
//   // });
//
//   UserChats.update(
//     {"userId": myId },
//     { "$set": { "msg.$.read": read } },
//     {"multi": true }
// );
//
//
//
// }



UserChatSchema.statics.findByUserId = function(id){
    var User = this;
    return User.findOne({userId: id});
};

UserChatSchema.statics.findByUserName = function(name){
    var User = this;
    return User.findOne({userName: name});
};


//CREATE THE USER MODEL
var UserChats = mongoose.model('UserChats', UserChatSchema);

module.exports = {
    UserChats
};
