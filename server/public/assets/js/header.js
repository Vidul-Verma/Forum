$(document).ready(function(){
	$('.admin-panel-nav').hide();
	var avatar = document.createElement("img");
	avatar.style.width = '28px';
	avatar.align = 'middle|left';
	avatar.id = "my_avatar";
	$.ajax({
  url: '/api/getavatar',
  method: "GET",
    success: (res) => {
			avatar.src = '/uploads/' + res;
			$('#profile').prepend(avatar);
    },
    error: () => {
      alert("Internal server error");
    }
  });

	$.ajax({
	url: '/api/getadmin',
	method: "GET",
		success: (res) => {
			if(res.admin){
				$('.admin-panel-nav').show();
				$('.admin-panel-nav').removeClass('hidden');

			}else{
				$('.admin-panel-nav').hide();
			}
		},
		error: () => {
			alert("Internal server error");
		}
	});

	$('.menu').click(function(){
			$('ul').toggleClass('active');
		})

		$('#search-btn').on('click' , () =>{
			let uri = $('.search-query').val();
			window.location.href = '/search?search='+ encodeURIComponent(uri) + "&pagesearch=1";
		})

	if (getCookie('u-auth')) {
		$.ajax({
			url: "/api/getnotificationcount",
			type: "get",
			success: (res) => {
	
				if (res.unreadCount) {
					$("#notification").html(res.unreadCount);
				}
			}
		})
	}


})
