$(document).ready(function(){

  if(!getCookie('x-auth') && !getCookie('dnd')){
    setTimeout(function() {
        $('.login-request').fadeIn('slow');
      }, 5000); // milliseconds

      $('#close-login-request').on('click', ()=>{
        $('.login-request').fadeOut('slow');
        document.cookie='dnd=true;path=/';
      })
  }


  $("#login_nav_button a").attr("href", "/login?continue="+encodeURIComponent(window.location.pathname + window.location.search));
  if (getCookie('u-auth')) {
    //SHOW
    $("#logout_nav_button").show();
    $("#avatar_username_nav_button").show();
    $('#profile').html('&nbsp; &nbsp;'+ getCookie('u-auth'));

    //HIDE
    $("#login_nav_button").hide();

  }
});

function logout() {
	$.ajax({
        type: 'delete',
        url: '/api/logout',
        success: function(r){
            $(location).attr('href','/');
        }
    });
}

function gotoProfile() {
	window.location.href = '/profile';
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
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
