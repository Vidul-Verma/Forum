const mongoose = require('mongoose');
const validator = require('validator');
const jwt  = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const cookieExpiryTime = 24*60*60*1000;
//CREATE A SCHEMA
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        //USING MONGOOSE VALIDATOR
        validate: {
//            validator: (value) =>{
//               return validator.isEmail(value);
//            }
            validator: validator.isEmail,

        }
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    admin: {
      type: Boolean,
      required: true,
      default:false
    },
    typeOfUser:{
      type: String,
      required: true,
      default: 'guest'
    },
    fullName: {
      type: String
    },
    about:{
      type: String
    },
    location:{
      type: String
    },
    votes:{
      type: Number,
      default: 0
    },
    posts:{
      type: Number,
      default: 0
    },
    userCreatedAt:{
      type: Date,
      default: Date.now,
       required: true
    },
    university:{
      type: String
    },
    major:{
      type: String
    },
    specialisation: {
      type: String
    },
    avatar: {
        type: String,
        default: null
    },
    activationKey: {
        type: String
    },
    passwordResetKey: {
        type: String
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    blocked:{
      type: Boolean,
      default: false,
      required: true
    },
    //SETUP TOKEN SCHEMA
    //THIS IS AN ARRAY OF OBJECTS
    //STORE TOKEN FOR INDIVIDUAL USER
    //CONTRARY TO SQL SCHEMA WHERE WE CANNOT STORE TOKEN FOR INDIVIDUAL USER
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
          type: Date,
          default: Date.now,
           required: true
         }
    }],
    bookmarkThreadIds: [
      String
    ],
    bookmarkReplyIds:[
      mongoose.Schema.Types.ObjectId
    ]
});

//OVERRIDE THE toJSON METHOD TO RETURN ONLY REQUIRED PROP OF THE USER OBJECT
// UserSchema.methods.toJSON = function() {
//     var user = this;
//     //CONVERT THE MONGOOSE VAR TO OBJECT
//     var userObject = user.toObject();

//     return _.pick(userObject, ['_id', 'email']);
// };


//CREATE AN INSTANCE METHOD IN THE USER SCHEMA
UserSchema.methods.generateAuthToken = function () {
    //INSTANCE METHOD GET CALLED WITH INDIVIDUAL DOCUMENT
    var user = this;
    var access = 'auth';

     var createdAt = new Date();

    //CREATE A TOKEN USING JSON WEB TOKEN
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET).toString();

    //DELETE EXPIRED TOKENS
    user.tokens = user.tokens.filter((token) => {
      return token.createdAt >= new Date(Date.now() - cookieExpiryTime);
    });
    //push the token to the above user array;
    user.tokens = user.tokens.concat([{access, token, createdAt}]);

    // RETURN PROMISE WITH PROMISE CHAINING SO THAT TOKEN CAN BE USED ON SERVER
    return user.save().then(() =>{
        return token;
    })
};

//INSTANCE METHOD FOR REMOVING TOKEN FOR LOGGING OUT FOR INDIVIDUAL USER
UserSchema.methods.removeToken = function(token){

    var user = this;
    return user.update({
        //PULL LETS YOU REMOVE ITEMS FROM THE ARRAY WHICH MATCH A CERTAIN CRITERIA
        $pull: {
            tokens: {
                token: token
            }
        }
    });

};

//CREATE A STATIC METHOD FOR USERSCHEMA
UserSchema.statics.findByToken = function(token){
    //MODEL METHOD GETS CALLED WITH THE MODEL AS THE THIS BINDING
    var User = this;
    //RETURN RESULT FROM JWT VERIFY
    var decoded;

    //JWT VERIFY FN THROWS AN ERROR IF ANYTHING GOES WRONG SO NEED TRY CATCH
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        //RETURN A PROMISE THATS ALWAYS GONNA REJECT
//        return new Promise((resolve, reject) =>{
//            reject();
//        });
        return Promise.reject();
    }
    //RETURN PROMISE TO ADD SOME CHAINING IN SERVER.JS
    //TO ADD A THEN CALL INTO FINDBYTOKEN OVER IN SERVERJS
    var twoHourBefore = new Date(Date.now() - cookieExpiryTime);
    return User.findOne({
        //GET THE ID FROM THE JWT VERIFIED USER
        '_id': decoded._id,
        //CHECK THE USER MODEL FOR THE SAME TOKEN AND GET THE USER
        'tokens.token': token,
        'tokens.access': 'auth',
        'tokens.createdAt': {$gt : twoHourBefore}
    });


};

//CREATE MODEL METHOD FOR LOGIN (GET TOKEN BY CREDENTIALS)
UserSchema.statics.findByCredentials = function(usernameOrEmail, password) {

    //GET THE USER SCHEMA TO FIND USER TOKEN WITH GIVEN CREDENTIALS
    var User = this;

    //FIND IF USER WITH GIVEN EMAIL PRESENT IN THE RECORDS

    var query = new Object();

    if(usernameOrEmail.includes('@')) {
        query.email = usernameOrEmail;
    } else {
        query.username = usernameOrEmail;
    }

    return User.findOne(query).then((user) =>{
       if(!user){
           return Promise.reject();
       }
        //RETURN PROMISE
        //USER BCRYPT COMPARE TO COMPARE THE PASSWORD TO THE USER.PASSWORD which is hashed
        return new Promise((resolve, reject) =>{
            bcrypt.compare(password, user.password, (err, res) =>{

                if(res){
                    resolve(user);
                }else{
                    reject(400);
                }
            });
        });

    });
};


//PASSWORD HASHING

//PRE MIDDLEWARE CALLED BEFORE SAVING A NEW USER
UserSchema.pre('save', function(next) {
   //GET DOC FOR EACH USER WITH THIS
    var user = this;

    //CHECK IF THE PASSWORD WAS MODIFIED
    //WE HASH ONLY THE MODIFIED PASSWORD AND IF ITS NOT MODIFIED HASHING A ALREADY HASHED PASSWORD WILL THROW ERRORS
    if(user.isModified('password')){

        bcrypt.genSalt(3, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) =>{

                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

//CREATE THE USER MODEL
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
