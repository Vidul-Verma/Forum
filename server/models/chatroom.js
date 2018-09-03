const mongoose = require('mongoose');
const _ = require('lodash');
var moment = require('moment');

var ChatRoomSchema = new mongoose.Schema({
  userIdOne: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
  },
  userNameOne:{
    type: String,
    required: true
  },
  avatarUserOne:{
    type: String,
    default: null
  },
  avatarUserTwo:{
    type: String,
    default: null
  },
  userNameTwo:{
    type: String,
    required: true
  },
  userIdTwo: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
  },
  msg:[{
    msg:{
      type: String,
      reqired: false
    },
    createdAt:{
      type : Date,
      default: Date.now,
      reqired: false

    },
    direction:{
      type: Boolean,
      required: true
    },
    deletedByUserOne:{
      type: Boolean,
      default: false
    },
    deletedByUserTwo:{
      type: Boolean,
      default: false
    }
  }],
  readByUserOne:{
    type: Number,
    default: 0
  },
  readByUserTwo:{
    type: Number,
    default: 0
  },
  lastMessageTime:{
    type: Date,
    default: Date.now,
     required: true
  },
  chatDeletedByUserOne:{
    type: Boolean,
    default: false
  },
  chatDeletedByUserTwo:{
    type: Boolean,
    default: false
  }
});

ChatRoomSchema.methods.addMsgFromUserOne = function(msg, emitted){

    var chatRoom = this;
    const direction = true;
    var createdAt = new Date();
    if(!emitted){
      chatRoom.readByUserTwo = chatRoom.readByUserTwo + 1;
    }

    chatRoom.msg = chatRoom.msg.concat([{msg, createdAt, direction}]);
    chatRoom.lastMessageTime = new Date();
    chatRoom.save().then(() =>{
        console.log('message saved user 1');
    });

};

ChatRoomSchema.methods.addMsgFromUserTwo = function(msg, emitted){

  var chatRoom = this;
  var createdAt = new Date();
  const direction = false;
  if(!emitted){
      chatRoom.readByUserOne = chatRoom.readByUserOne + 1;
  }

  chatRoom.msg = chatRoom.msg.concat([{msg, createdAt, direction}]);
  chatRoom.lastMessageTime = new Date();
  chatRoom.save().then(() =>{
      console.log('message saved user 2');
  });

};

// ChatRoomSchema.methods.saveLastMessageTime = function(){
//   var lastMsgTime = new Date();
//   var chatRoom = this;
//   chatRoom.lastMessageTime = lastMsgTime;
//   chatRoom.save().then(()=>{
//     console.log('Last msg time saved');
//   }).catch((err)=>{
//     console.log('Error saving time'+ err);
//   })
// }

ChatRoomSchema.statics.resetReadMsg = function(userNameOne, userNameTwo){
  ChatRoom = this;

  ChatRoom.findOne({$or: [{'userNameOne': userNameOne, 'userNameTwo': userNameTwo}, {'userNameOne': userNameTwo, 'userNameTwo': userNameOne}]})
  .then((chat) =>{

    if(chat.userNameOne == userNameOne){
      chat.readByUserOne = 0;
    }else{
      if(chat.userNameTwo == userNameOne){
        chat.readByUserTwo = 0;
      }
    }

    chat.save().then(() =>{
      console.log('Value reset to 0');
    })
  }).catch((err) =>{
    console.log(err);
  })

}


var ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = {
    ChatRoom
};
