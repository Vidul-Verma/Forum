var chatArray;
var allUsers = [];
var myName;
var directionToConsider;
var token = getCookie('x-auth');
var socket = io.connect('', {
    query: { token: token }
});
var fillForDate;


$(document).ready(function() {

    //HIDE WITH USER NAME icon
    $('#withName').hide();
    $('#comment').val('');

    $('#userClicked').val('');
    $.ajax({
        type: 'GET',
        url: '/chat/me',
        success: function(data, textStatus, request) {
            myName = data.username;
            myAvatar = data.avatar;
            var template = $('#show-name').html();
            var html = Mustache.render(template, {
                name: myName,
                avatar: myAvatar
            });
            $('#showMyName').append(html);
            document.getElementById("my_profile_pic_1").src = "/uploads/" + myAvatar;
            getChatsFromServer();
        }
    });

    $('#comment').keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $("#createMsg").click();
        }
    });


    var searchTimeout;
    $('#searchText').keydown((event) => {
        clearTimeout(searchTimeout);
    })

    $('#searchText').keyup((event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchForQuery, 500);
    })

    function searchForQuery() {
        var searchText = $('#searchText').val();
        if (!searchText.length) {
            $('#searchResults').hide();
            $('#messagesFrom').css({ "opacity": "0.5" }).fadeTo("fast", 1);
        } else {
            $('#messagesFrom').hide();
            $('#searchResults').html('');
            $('#searchResults').css({ "opacity": "0.5" }).fadeTo("fast", 1);
        }

        var searchUsers = allUsers.filter((user) => {
            if (user.startsWith(searchText)) return user;
        });

        searchUsers.forEach((user) => {
            var template = $('#user-template').html();
            var html = Mustache.render(template, {
                userName: user
            });
            $('#searchResults').append(html);
        })
    }
    $(window).resize(function() {
        if ($(window).width() > 700) {
            $('.conversation').css({ "opacity": "0" }).fadeTo("fast", 1);
            $('.side').css({ "opacity": "0" }).fadeTo("fast", 1);
        }
    });
    $('#menu').on('click', function() {
        $('.conversation').css({ "opacity": "1" }).fadeTo("fast", 0);
        $('.side').css({ "opacity": "0" }).fadeTo("fast", 1);
    })


    function getChatsFromServer() {
        $.ajax({
            type: 'POST',
            url: '/user/chat/chatnames',
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else if (jqXHR.status === 400) {
                    msg = 'Please check your credentials';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert(msg);
            },
            success: function(data, textStatus, request) {
                console.log("XXXX");
                console.log(data);

                //SET ALL MESSAGES TO MSG array
                chatArray = data;

                //FIND ALL THE USERS INTERACTED WITH
                console.log('CHAT DATA')
                console.log(data)
                //SOME ERROR IN ABOVE DATA

                $(data).each(function(i, chat) {
                    console.log('myName: ' + myName + ' 1: ' + chat.userNameOne + " " + chat.avatarUserOne + " " + ' 2: ' + chat.userNameTwo + " " + chat.avatarUserTwo);
                    if (chat.userNameTwo === myName) {
                        if (!userExists(chat.userNameOne)) {
                            addUserIntoChats(i, chat.userNameOne, chat.readByUserTwo, false, chat.avatarUserOne);
                            allUsers.push(chat.userNameOne);
                        }

                    } else {
                        if (chat.userNameOne === myName) {
                            if (!userExists(chat.userNameTwo)) {
                                addUserIntoChats(i, chat.userNameTwo, chat.readByUserOne, false, chat.avatarUserTwo);
                                allUsers.push(chat.userNameTwo);
                            }
                        }
                    }
                });
                console.log(allUsers);

                let chatWithUser = gup("open_chat");
                if (chatWithUser) {
                    createChatAjax(chatWithUser);
                }
            }
        });
    }




    socket.on('connect', function() {

        console.log('connected to the server');

        //REAL TIME MESSAGING



        //CREATE USERNAME
        $("#savebutton").on('click', function() {
            var to = $('#toUserName').val();
            to = to.replace(/\s/g, '');

            setCurrentUserNameModal(to);

            $('#addNewChat').modal('hide');
            $('#toUserName').val('');
        });
    });

    //GET MSG FROM THE SERVER
    socket.on('newMsg', function(msg) {
        console.log("newMsg")
        console.log(msg)
        var activeUser = $('#userClicked').val();
        var currentUser = $('#userClicked').val()

        var template;
        if (activeUser === msg.userName) {
            //USER ALREADY IN THE LIST AND ACTIVE

            reorderToTop(msg.userName)

            template = $('#message-template-from-nodelete').html();
            var formattedTime = moment(msg.createdAt).format('h:mm a');
            var html = Mustache.render(template, {
                msg: msg.msg,
                createdAt: formattedTime
            });
            $('.selectmessage').fadeOut('fast')
            $('#showmessages').append(html);
            $('#showmessages').animate({
                scrollTop: $('#showmessages').prop("scrollHeight"),
            }, 500);

            //TEMPORARY SOLUTION FOR READ
            serverMarkReadAJAX(msg.userName);


        } else {
            // USER EXITS DURING CHAT AND NEW MESSAGE ARRIVES

            if (!userExists(msg.userName)) {
                //USER NOT IN THE LIST
                allUsers.push(msg.userName);
                addUserIntoChats(allUsers.length - 1, msg.userName, 1, true, msg.avatar);
            } else {
                //USER ALREADY IN THE LIST BUT NOT ACTIVE
                reorderToTop(msg.userName)
                incrementUnreadCount(msg.userName);
            }

            //CHECK THE USERS ARRAY AND APPEND THE Number
            // $(chatArray).each(function(i, chat){
            //   if(chat.userNameOne == msg.userName){
            //
            //   }else{
            //     if(chat.userNameTwo == msg.userName){
            //
            //     }
            //   }
            // });


        }

    });


    //SEND NEW MESSAGE CLICK ON BUTTON
    $("#createMsg").on('click', function() {

        var to = $('#userClicked').val();
        var msg = $('#comment').val();
        $('#comment').val('');
        $("#comment").focus();

        if (!msg.trim().length) {
            alert("Cannot send blank message");
            return;
        }

        to = to.replace(/\s/g, '');

        var formattedTime = moment(msg.createdAt).format('h:mm a');

        var template = $('#message-template-to-nodelete').html();

        var html = Mustache.render(template, {
            from: to,
            msg: msg,
            createdAt: formattedTime
        });
        $('.selectmessage').fadeOut('fast')
        $('#showmessages').append(html);
        $('#showmessages').animate({
            scrollTop: $('#showmessages').prop("scrollHeight"),
        }, 500);

        socket.emit('createMsg', {
            to: to,
            msg: msg
        }, function(data) {
            reorderToTop(to);
            console.log('Got acknowledged' + data);
        });

    });


    //DISCONNECT FROM Server
    socket.on('disconnect', function() {
        console.log("disconnected from server");
    });

    //PERFORM DELETE FUNCTION
    $('#showmessages').on('click', 'p .delete-btn', function() {
        var val = $(this).attr('id');

        if (window.confirm('Delete the message')) {



            var data = {
                msgId: val
            };
            $.ajax({
                type: 'POST',
                data: data,
                datatype: 'json',
                url: '/user/chat/deleteindividualmessage',
                success: function(data, textStatus, request) {

                    $('#m' + val).remove();
                }
            });

        } else {
            // They clicked no
        }
    })

});
//END LOAD DOC

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

$('.sideBar').on('click', '.sideBar-body', function(eventt) {

    if ($(window).width() <= 700) {
        $('.side').css({ "opacity": "1" }).fadeTo("fast", 0);
        $('.side').css({ 'display': 'none' });
        $('.conversation').css({ "opacity": "0" }).fadeTo("fast", 1);
    }

    var val = $(this).attr('userName');
    setCurrentUserName(null, val);

    $('#searchText').val('');
    $('#searchResults').hide();
    $('#messagesFrom').css({ "opacity": "0.5" }).fadeTo("fast", 1);
});


//HANDELLING RIGHT CLICK MENU
var menuParent;

$(".sideBar").on('contextmenu', '.sideBar-body', function(event) {
    event.preventDefault();
    $(".custom-menu").finish().toggle(100).css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
    menuParent = $(this);
})


$(".custom-menu #delete_custom_menu").on("click", function(e) {
    $(".custom-menu").hide(100);
    console.log(menuParent);
    deleteEntireChat(menuParent);
})

$(".custom-menu #cancel_custom_menu").on('click', function(e) {
    $(".custom-menu").hide(100);
})

// $(document).on("mousedown", function (e) {
//     // $(".custom-menu").hide(100);
// });

//END OF RIGHT CLICK MENT

//SET CURRENT USER AND SHOW MESSAGES FOR HIM
function setCurrentUserName(userName, stringUserName) {
    var username;
    if (stringUserName != null) {
        username = $.trim(stringUserName);
    } else {
        if (userName != null) {
            username = $.trim(userName.innerHTML);
        }
    }
    console.log(username);

    $('#comment').val('');

    $('.message').css({ "opacity": "0.5" }).fadeTo("fast", 1);
    $('.reply').css({ "opacity": "0.5" }).fadeTo("slow", 1);


    $('.sideBar-body').removeClass('sideBar-body-active');
    $('#' + allUsers.indexOf(username)).addClass('sideBar-body-active');


    $('#userClicked').val(username);

    //SET THE USER ON RIGHT BAR
    var node = document.getElementById('currentUserName');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    var x = document.createElement("A");
    x.className = 'heading-name-meta';
    x.innerHTML = ' ';
    x.innerHTML = username;
    x.href = '/profile?username=' + username;
    node.append(x);
    $('#withName').css({ "opacity": "0.5" }).fadeTo("fast", 1);
    $('.selectmessage').fadeOut('fast')
    $('#showmessages').html('');



    //SEND USERNAME WITH ALL MESSAGES SEE TO SAVE THE READ MESSAGES
    var data = {
        userName: username
    }
    // READ AJAX
    serverMarkReadAJAX(username);

    if ($('#userClicked').val() == username) {
        //REFRESH MSGS FROM DB
        $.ajax({
            type: 'POST',
            data: data,
            datatype: 'json',
            url: '/user/chat/personalmessages',
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else if (jqXHR.status === 400) {
                    msg = 'Please check your credentials';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert(msg);
            },
            success: function(data, textStatus, request) {
                console.log(data);
                var msgArray = data;

                $(msgArray).each(function(i, chat) {

                    // var formattedTime = moment(msg.createdAt).format('h:mm a');

                    if (chat.userNameOne == myName) {
                        if (username == chat.userNameTwo) {
                            directionToConsider = true;
                            fillMessages(chat.msg);
                        }

                    } else {
                        if (username == chat.userNameOne) {
                            directionToConsider = false;
                            fillMessages(chat.msg);
                        }
                    }


                });
            }

        });


    }





    $('#userClicked').val(username);
}


function setCurrentUserNameModal(userName) {
    createChatAjax(userName);
}

function fillDate(fillForDate) {
    template = $('#message-template-date').html();
    var formattedDate = moment(fillForDate).format('DD/MM/YYYY');
    var html = Mustache.render(template, {
        createdDate: formattedDate
    });
    $('.selectmessage').fadeOut('fast')
    $('#showmessages').append(html);
}

function fillMessages(msg) {


    $(msg).each(function(i, individualMsg) {
        if (fillForDate == null || moment(fillForDate).isBefore(individualMsg.createdAt, 'day')) {
            fillForDate = individualMsg.createdAt;
            fillDate(fillForDate);
        }

        if (directionToConsider && individualMsg.direction) {
            template = $('#message-template-to').html();
        } else if (!directionToConsider && !individualMsg.direction) {
            template = $('#message-template-to').html();
        } else if (!directionToConsider && individualMsg.direction) {
            template = $('#message-template-from').html();
        } else if (directionToConsider && !individualMsg.direction) {
            template = $('#message-template-from').html();
        } else {
            console.log('WHO SENT THE MESSAGE???');
        }

        var formattedTime = moment(individualMsg.createdAt).format('h:mm a');
        var html = Mustache.render(template, {
            msgId: individualMsg._id,
            msg: individualMsg.msg,
            createdAt: formattedTime
        });
        $('.selectmessage').fadeOut('fast')
        $('#showmessages').append(html);

    });
    $('#showmessages').scrollTop($('#showmessages').prop("scrollHeight"));
    fillForDate = null;


    var data = {
        username: $.trim(msg.withUserName)
    }

}

function userExists(username) {
    console.log(allUsers);
    if ($.inArray(username, allUsers) > -1) {
        return true;
    } else {
        return false;
    }


}

function addUserIntoChats(displayId, from, num, prepend, avatar) {
    console.log(displayId + ' ' + avatar)
    // console.log('displayId: '+displayId+', from: '+from+', num: '+ num);
    //NUM IS THE NO. OF NEW MESSAGES
    var template = $('#user-template').html();

    if (num > 0) {
        var html = Mustache.render(template, {
            displayId: displayId,
            userName: from,
            num: num,
            avatar: (avatar) ? ("/uploads/" + avatar) : "/assets/images/avatar.png"
        });
    } else {
        var html = Mustache.render(template, {
            displayId: displayId,
            userName: from,
            num: '',
            avatar: (avatar) ? ("/uploads/" + avatar) : "/assets/images/avatar.png"
        });
    }

    console.log(prepend)

    if (prepend)
        $('#messagesFrom').prepend(html);
    else
        $('#messagesFrom').append(html);
}

function checkAndPushArray(element, arrayName) {
    var found = jQuery.inArray(element, arrayName);
    if (found >= 0) {

        alert('User Already Exists in your chats');
        return false;

    } else {
        // Element was not found, add it.
        arrayName.push(element);
        return true;
    }
}

function setUnreadCount(username, count) {
    var currUnreadCountDiv = $("#" + allUsers.indexOf(username) + " .unread_count");
    if (count == 0) {
        currUnreadCountDiv.html('');
    } else {
        currUnreadCountDiv.html(count.toString());
    }
}

function incrementUnreadCount(username) {
    var currUnreadCountDiv = $("#" + allUsers.indexOf(username) + " .unread_count");
    if (currUnreadCountDiv.html().length > 0) {
        var newCount = parseInt(currUnreadCountDiv.html()) + 1;
        currUnreadCountDiv.html(newCount.toString());
    } else {
        currUnreadCountDiv.html('1');
    }
}

function serverMarkReadAJAX(username) {
    $.ajax({
        type: 'POST',
        datatype: 'json',
        data: { userName: username },
        url: '/user/chat/read',
        success: function(data, textStatus, request) {
            setUnreadCount(username, 0);
        }
    });
}

function createChatAjax(userName) {

    var data = {
        userName: $.trim(userName)
    }

    if (!userExists($.trim(userName))) {
        $.ajax({
            type: 'POST',
            datatype: 'json',
            data: data,
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 503) {
                    msg = 'User not registered. Please check username';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else if (jqXHR.status === 400) {
                    msg = 'Please check your credentials';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert(msg);
            },
            url: '/user/chat/createchatroom',
            success: function(data, textStatus, request) {
                console.log(data)
                //SET THE USER ON RIGHT BAR


                // var node = document.getElementById('currentUserName');
                // while (node.hasChildNodes()) {
                //     node.removeChild(node.lastChild);
                // }
                //   var x = document.createElement("A");
                //   x.className = 'heading-name-meta';
                //   x.innerHTML = ' ';
                //   x.innerHTML = userName;
                //   node.append(x);
                //     $('#withName').css({ "opacity":"0.5"}).fadeTo("fast", 1);
                if (checkAndPushArray(userName, allUsers)) {

                    // var tempTemplate = $('#user-template').html();
                    // var html = Mustache.render(tempTemplate, {
                    //    displayId: (allUsers.length-1),
                    //   userName: userName
                    // });
                    // $('#messagesFrom').append(html);

                    if (userName === data.userNameOne) {
                        addUserIntoChats(allUsers.length - 1, userName, 0, true, data.avatarUserOne);
                    } else {
                        addUserIntoChats(allUsers.length - 1, userName, 0, true, data.avatarUserTwo);
                    }
                    setCurrentUserName(null, userName);

                } else {
                    if (!checkAndPushArray(userName, allUsers)) {
                        setCurrentUserName(null, userName);
                    }
                }

                // $('#showmessages').html('');
                //  $('.message').css({ "opacity":"0.5"}).fadeTo("fast", 1);
                //   $('.reply').css({ "opacity":"0.5"}).fadeTo("slow", 1);
                // $('#userClicked').val(userName);

                socket.emit('createMsg', {
                    to: userName,
                    msg: "Chat initiated"
                }, function(data) {
                    $('#comment').val('');
                    console.log('Got acknowledged' + data);
                });

            } //SUCCESS

        });

    } else {
        // alert('user already exists!!');
        setCurrentUserName(null, $.trim(userName));
    }

}

$('#logout_btn').click(function() {
    $.ajax({
        type: 'delete',
        url: '/api/logout',
        success: function(r) {
            $(location).attr('href', '/');
        }
    });
})


function closeChat() {
    $('#userClicked').val('');

    $('#showmessages').html('');
    $('#showmessages').hide();
    $('.selectmessage').fadeIn('slow')
    $('#currentUserName').html('');
    $('#withName').hide();
    $('.reply').hide();
}

function deleteEntireChat(userTemplate) {
    var username = userTemplate.attr('username');

    if (window.confirm('Delete entire chat?')) {

        var data = {
            remoteUsername: username
        };
        $.ajax({
            type: 'POST',
            data: data,
            datatype: 'json',
            url: '/api/deleteallmessages',
            success: function(data, textStatus, request) {
                userTemplate.remove();
                allUsers[allUsers.indexOf(username)] = 'LKJOSILVKIJLEFJKSLJ329R8U9C';
                closeChat();
            }
        });

    }
}

function reorderToTop(username) {
    var chatUsernameDiv = $("#" + allUsers.indexOf(username));
    chatUsernameDiv.remove();
    $('#messagesFrom').prepend(chatUsernameDiv);
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
