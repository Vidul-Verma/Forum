$(document).ready(function(){
	if (!gup("k")) {
		$("#create_new_password_form").html("This password reset link has been expired. Please generate a new one.");
	}
})
$("#create_password_button").on("click", function() {
	if ($("#password_input").val().length < 8) {
        $('#password_input').attr("placeholder", "Password must be at least 8 characters long").val("").focus().blur();
        $('#cnf_password_input').attr("placeholder", "Password must be at least 8 characters long").val("").focus().blur();
		return;
	} else if ($("#password_input").val() !== $("#cnf_password_input").val()) {
		$('#cnf_password_input').attr("placeholder", "Password and Confirm password do not match").val("").focus().blur();
		return;
	}
	let data = {
		password: $("#password_input").val(),
		key: gup("k")
	}
	console.log(data);
	$.ajax({
		url: "/api/passwordreset",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: (res) => {
			switch(res.result) {
				case "SUCCESS":
					$("#create_new_password_form").html("<i class='fas fa-check-circle'></i> New password created successfully. Please login using new password. <a href='/login'>LOGIN</a>");
					break;
				case "INVALID_KEY":
					$("#create_new_password_form").html("<i class='fas fa-times-circle'></i> This password reset link has been expired. Please generate a new one.");
					break;
			}
		},
		error: (res) => {
			$("#create_new_password_form").html("Internal server error");
		}
	})
})

function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}