var mongoose = require('mongoose');

//ADD PROMISE LIB TO MONGOOSE
mongoose.Promise = global.Promise;
//CHECK IF MONGODB URI EXIST IN HEROKU
mongoose.connect('mongodb://localhost:27017/LoginSystem');
// mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/LoginSystem');
//mongoose.connect( 'mongodb://localhost:27017/TodoApp');
//EXPORT THE MONGOOSE VAR
module.exports = {
    mongoose
};
