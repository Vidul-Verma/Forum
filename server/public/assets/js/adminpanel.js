$(document).ready(function() {

  let urlArray = window.location.href.split("/");
  option = urlArray[4].split('?')[0];

  var i = document.createElement("i");
  i.className = 'fa fa-chevron-right pull-right';
  $("#"+ option).append(i);

});
