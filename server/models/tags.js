const mongoose = require('mongoose');

var TagsSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    tagCreators:[mongoose.Schema.Types.ObjectId],
    tagCreatorsNames: [String],
    threadIds: [{
            type: mongoose.Schema.Types.ObjectId
        }]
});

var Tags = mongoose.model('Tags', TagsSchema);

module.exports = {
    Tags
};
