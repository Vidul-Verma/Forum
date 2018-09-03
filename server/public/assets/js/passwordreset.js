$("#reset_button").on("click", function() {
	if ($("#email_input").val() == "") {
        $('#email_input').attr("placeholder", "Please enter valid email or username").val("").focus().blur();
		return;
	}
	let data = {
		email: $("#email_input").val()
	}
	console.log(data);
	$.ajax({
		url: "/api/requestpasswordreset",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: (res) => {
			switch(res.result) {
				case "SUCCESS":
					$("#password_reset_form").html("Password reset link sent on your email. Please check you inbox.");
					break;
				case "NO_ACCOUNT":
					$("#password_reset_form").html("No account found associated with this email address.");
					break;
			}
		},
		error: (res) => {
			$("#password_reset_form").html("Internal server error");
		}
	})
})