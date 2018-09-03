const mongoose = require('mongoose');

var ThreadCategorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    categorydescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      default: 'Description'
    },
    primary:{
      type: Boolean,
      required: false,
      default: false
    },
    parentcategory: {
      type:  mongoose.Schema.Types.ObjectId
    },
    parentcategoryName:{
      type: String,
      required:false
    },
    threadcount: {
      type: Number,
      required: true,
      default: 0
    },
    posts:{
      type: Number,
      required: true,
      default: 0
    }
});

var ThreadCategory = mongoose.model('ThreadCategory', ThreadCategorySchema);

module.exports = {
    ThreadCategory
};
