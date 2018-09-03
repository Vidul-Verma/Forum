const mongoose = require('mongoose');

var blogCommentsSchema = new mongoose.Schema({
  blogId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  comment:{
    type: String,
    trim: true,
    minlength: 1
  },
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  creatorUsername:{
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  avatar: {
      type: String,
      default: null
  },

});

var BlogComments = mongoose.model('BlogComments', blogCommentsSchema);

module.exports = {
  BlogComments
};
