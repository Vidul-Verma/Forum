// var users = [];
//
// var addUser = (id, name, room) =>{
//   users.push({});
// }
//
// modules.export = {addUser}

class Users{
  constructor ( ) {
    this.users = [];
  }
  addUser (userId, userName, socketId) {
    var user = {userId, userName, socketId};
    this.users.push(user);
    return user;

  }

  getActiveUserIds () {
    var user = this.users;

    var userIdArray = this.users.map((user) =>{
      return user.userId;
    });

    return userIdArray;
  }

  getActiveUserNames () {

    var user = this.users;
    var activeUserNames = [];
    user.forEach((element) =>{
      activeUserNames.push(element.userName);
    })



  }

  getUser (id){
    return this.users.filter((user) =>{
      return user.socketId === id;
    })[0];
  }

  getUserByName (name){
    return this.users.filter((user) =>{
      return user.userName === name;
    })[0];
  }

  removeUser(id){
    var user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user) =>{
        return user.socketId !== id;
      });
    }

    // console.log(userList);

      return user;


  }


}

module.exports = {Users};
