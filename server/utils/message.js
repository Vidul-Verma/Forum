var moment = require('moment');


var generateMsg = (fromId, fromName, msg, avatar) =>{
  return {
    userName: fromName,
    msg: msg,
    createdAt: moment().valueOf(),
    avatar: avatar
  };

};

module.exports = {generateMsg};
