$(document).ready(function(){

    $('#login_email').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $("#login_password").focus();
        }
    });

    $('#login_password').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $("#login_button").click();
        }
    });

  $('#login-form-link').click(function(e) {
		$("#login-form").fadeIn(500);
    $(".left-hr").fadeIn(500);
    $(".right-hr").fadeOut(500);
 		$("#register-form").fadeOut(0);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").fadeIn(500);
    $(".right-hr").fadeIn(500);
    $(".left-hr").fadeOut(500);
 		$("#login-form").fadeOut(0);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});



    $("#login_email, #register_email").val('');
    $("#register_confirm_password, #register_password").keyup(checkPasswordMatch);

    $("#register_email").keyup(isEmailBoxRegister);

    $("#register_password").keyup(checkRegisterPass);

});

$('#login_button').click(function(){

    var usernameOrEmail = $('#login_email').val();
    var password = $('#login_password').val();

    if (!usernameOrEmail.length) {
        $('#login_email').attr("placeholder", "Please enter valid email or username").val("").focus().blur().css("color","#ff0000");
    } else if (!password.length) {
        $('#login_password').attr("placeholder", "Please enter password").val("").focus().blur().css("color","#ff0000");
    } else {
        var logincredentials = new Object();
        logincredentials.password = password;

        if (usernameOrEmail.includes('@')) {
            logincredentials.email = usernameOrEmail;
        } else {
            logincredentials.username = usernameOrEmail;
        }

        $.ajax({
            type: 'POST',
            url:'/users/login',
            data: logincredentials,
            error: function (jqXHR, exception) {
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
                }else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                $('#login_password').attr("placeholder", "Please check your password").val("").focus().blur().css("color","#ff0000");
                $('#loginpasswordtick').css({"display":"none"});
                $('#loginpasswordredtick').css({"display":"none"});
            },
            success: function(data , textStatus, request){
                var d = new Date();
                d.setDate(d.getDate()+1);
                var expires = "expires="+d.toUTCString();
                document.cookie='x-auth='+ request.getResponseHeader('x-auth')+ ";" + expires + ";path=/";
                document.cookie='u-auth='+ data+ ";" + expires + ";path=/";
                document.cookie='a-auth='+ request.getResponseHeader('a-auth')+ ";" + expires + ";path=/";
                if (findGetParameter("continue")) {
                    location.href = findGetParameter("continue");
                } else {
                    location.href = '/forum';
                }
            },
            complete: function(xhr, status){
              if(xhr.responseText == 'blocked'){
                var div = document.createElement("div");
                div.className = 'newclass';
                div.style.color = '#CC3232';
                div.innerHTML= 'Account blocked. Request ashish@unimantra.com for unblocking.';
                $('.login').append(div);
              }else{
                if(xhr.responseText == 'inactive'){
                  var div = document.createElement("div");
                  div.className = 'newclass';
                  div.style.color = '#CC3232';
                  div.innerHTML= 'Please activate your account to login';
                  $('.login').append(div);
                }
              }
            }

        });
    }
});

function checkPasswordMatch() {
    var password = $("#register_password").val();
    var confirmPassword = $("#register_confirm_password").val();

    if (password != confirmPassword){
          $('#registerconfirmpasswordredtick').css({"display":"block"});
          $('#registerconfirmpasswordtick').css({"display":"none"});
    }else{
      if(password == confirmPassword){
        $('#registerconfirmpasswordredtick').css({"display":"none"});
        $('#registerconfirmpasswordtick').css({"display":"block"});
      }else{
        $('#registerconfirmpasswordredtick').css({"display":"none"});
        $('#registerconfirmpasswordtick').css({"display":"none"});
      }

    }

}

// function checkLoginPass() {
//     var password = $("#login_password").val();
//     if(testPassword(password)){
//         $('#loginpasswordtick').css({"display":"block"});
//         $('#loginpasswordredtick').css({"display":"none"});
//     }else{
//         if(!testPassword(password)){
//             $('#loginpasswordtick').css({"display":"none"});
//             $('#loginpasswordredtick').css({"display":"block"});
//         }else{
//             $('#loginpasswordtick').css({"display":"none"});
//             $('#loginpasswordredtick').css({"display":"none"});
//         }
//     }
// }

function checkRegisterPass() {
    var password = $("#register_password").val();
    if(testPassword(password)){
        $('#registerpasswordtick').css({"display":"block"});
        $('#registerpasswordredtick').css({"display":"none"});
    }else{
        if(!testPassword(password)){
            $('#registerpasswordredtick').css({"display":"block"});
            $('#registerpasswordtick').css({"display":"none"});
        }else{
            $('#registerpasswordredtick').css({"display":"none"});
            $('#registerpasswordtick').css({"display":"none"});
        }
    }
}

function testPassword(value) {
   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
}


function isEmailBoxRegister(){
    var remail = $('#register_email').val();
    if( !isEmail(remail)){

        if(!isEmail(remail)){
            $('#registeremailredtick').css({"display":"block"});
            $('#registeremailtick').css({"display":"none"});
        }

    }else{
        if( isEmail(remail)){

            if(isEmail(remail)){
                $('#registeremailtick').css({"display":"block"});
                $('#registeremailredtick').css({"display":"none"});
            }

        }else{
          $('#registeremailtick').css({"display":"none"});
          $('#registeremailredtick').css({"display":"none"});

        }
    }
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}


$('#register_button').click(function(){

    var email = $('#register_email').val();
    var username = $('#user_name').val();
    var password = $('#register_password').val();
    var confirmPassword = $('#register_confirm_password').val();

     if(!isEmail(email) || !password || password != confirmPassword){
         if(!isEmail(email)){
            $('#register_email').attr("placeholder", "Please enter valid email").val("").focus().blur().css("color","#ff0000");
        }

        if(!password){
            $('#register_password').attr("placeholder", "Please enter password").val("").focus().blur().css("color","#ff0000");
        }
        if(password != confirmPassword){
            $('#register_confirm_password').attr("placeholder", "Password doesnot match").val("").focus().blur().css("color","#ff0000");
        }
     }else{
         var registercredentials = {username: username, email: email, password: password};
         ajaxForRegister(registercredentials);

     }
});

$('#login_email').click(function(){
    $('#login_email').css("color","#000000");
});

$('#login_password').click(function(){
    $('#login_password').css("color","#000000");
});

$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut();
        $('.login-info-box').fadeIn();

        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');

    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();

        $('.white-panel').removeClass('right-log');

        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName && tmp[1]) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName && tmp[1]) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function ajaxForRegister(registercredentials){
   $.ajax({
      type: 'POST',
      url:'/users',
      data: registercredentials,
      error: function (jqXHR, exception) {
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
              msg = 'User already exists';
          }else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
          }
          alert(msg);
      },
      success: function(data){

  $('#activation_message').html('Please check your email for activation code! <br><br>');
  var btn = document.createElement("BUTTON");// Create a <button> element
  btn.className = 'btn btn-register';
  btn.id = 'resendcode-button';
  btn.type = "button";
  var t = document.createTextNode("Resend Code");       // Create a text node
  btn.appendChild(t);
   $('#activation_message').append(btn);
   $('#resendcode-button').on('click', ()=>{
     ajaxForResendActivationCode(registercredentials);
   })
      }
  });
}

function ajaxForResendActivationCode(registercredentials){
  $.ajax({
     type: 'POST',
     url:'/users',
     data: registercredentials,
     error: function (jqXHR, exception) {
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
             msg = 'User already exists';
         }else {
             msg = 'Uncaught Error.\n' + jqXHR.responseText;
         }
         alert(msg);
     },
     success: function(data){
       alert('activation code sent!');
     }
 });
}

function ajaxForLogin(registercredentials){
          $.ajax({
              type: 'POST',
              url:'/users/login',
              data: registercredentials,
              error: function (jqXHR, exception) {
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
          }else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
          }
          $('#register_password').attr("placeholder", "Please check your password").val("").focus().blur().css("color","#ff0000");
          $('#registerpasswordtick').css({"display":"none"});
          $('#registerpasswordredtick').css({"display":"none"});
      },
              success: function(data , textStatus, request){
                  var d = new Date();
                  d.setDate(d.getDate()+1);
                  var expires = "expires="+d.toUTCString();
                  document.cookie='x-auth='+ request.getResponseHeader('x-auth')+ ";" + expires + ";path=/";
                  document.cookie='u-auth='+ data+ ";" + expires + ";path=/";
                  document.cookie='a-auth='+ request.getResponseHeader('a-auth')+ ";" + expires + ";path=/";
                  location.href = '/forum';


      }
  });
}
