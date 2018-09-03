const mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    body: {
        type: String,
        required: true,
        minlength: 1
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
      },
    creatorUsername: {
        type: String,
        required: true
    },
    avatar:{
      type: String,
      default: null
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        trim: false
    },
    categoryName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastReplyAt: {
        type: Date,
        required: true
    },
    compositeId: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    replycount: {
      type: Number,
      required: true,
      default: 0
    },
    upvoteCount:{
      type: Number,
      required:true,
      default:0
    },
    upvoteUsernames: [{
            type: String
        }],
    tags: [{
                type: String
        }],
    views:{
      type: Number,
      default: 0,
      required: true
    },
    lastReplyBy: {
      type: String
    },
    closed:{
      type: Boolean,
      required: true,
      default: false
    }

});

ThreadSchema.index({title: 'text', body: 'text'});

var Thread = mongoose.model('Thread', ThreadSchema);

module.exports = {
    Thread
};
