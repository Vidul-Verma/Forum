const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');


var BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
    },
    body: {
        type: String
    },
    bodysmall: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    views: {
        type: Number,
        default: 0,
        required: true
    },
    upvotes: {
        type: Number,
        required: true,
        default: 0
    },
    upvoteUsernames: [{
        type: String
    }],
    comments: {
        type: Number,
        required: true,
        default: 0
    },
    featuredImage: {
        type: String,
        required: false
    }
});


var Blog = mongoose.model('Blog', BlogSchema);

module.exports = {
    Blog
};
