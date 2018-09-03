const mongoose = require('mongoose');

var replySchema = new mongoose.Schema({
  threadId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  threadTitle:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  body:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  replyNumber:{
    type: Number,
    default: 0
  },
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  creatorUsername:{
    type: String
  },
  creatorType: {
    type: String
  },
  avatar:{
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  comments:[{
    comment:{
      type: String,
      reqired: false
    },
    createdAt:{
      type : Date,
      default: Date.now,
      reqired: false
    },
    creatorId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    creatorUsername: {
      type: String,
      required: true
    }
  }],
  upvoteUsernames: [{
          type: String
      }],
  replyDeleted:{
    type: Boolean,
    required: true,
    default: false
  }
});

var Reply = mongoose.model('Reply', replySchema);

module.exports = {
  Reply
};
