$(document).ready(function() {
	$.ajax({
		url: "/activateuser/"+gup("a"),
		type: "get",
		success: (res) => {
			switch(res.result) {
				case "SUCCESS":
					document.getElementById("display_msg_div").style.color = '#43a443';
					$("#display_msg_div").html("Your account has been activated successfully.")
					break;
				case "INVALID_KEY":
					document.getElementById("display_msg_div").style.color = '#CC3232';
					$("#display_msg_div").html("This activation link is invalid, expired or already used.");
					break;
				default:
					$("#display_msg_div").html("Internal server error. Please try again later");
			}
		},
		error: (res) => {
			$("#display_msg_div").html("Internal server error. Please try again later");
		}
	})

	$('#login_button').on('click' , () =>{
		window.location.href = '/login';
	})
});

function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
