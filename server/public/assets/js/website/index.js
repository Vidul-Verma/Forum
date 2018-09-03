$("#submitbutton").on("click", function() {


	let formValid = true;

	//validation
	if ($("#first_name_input").val() == "") {
		$("#first_name_error").show();
		formValid = false;
	} else $("#first_name_error").hide();

	if ($("#last_name_input").val() == "") {
		$("#last_name_error").show();
		formValid = false;
	} else $("#last_name_error").hide();

	if ($("#email_input").val() == "" || !validateEmail($("#email_input").val())) {
		$("#email_error").show();
		formValid = false;
	} else $("#email_error").hide();

	if ($("#message_input").val() == "") {
		$("#message_error").show();
		formValid = false;
	} else $("#message_error").hide();

	if (formValid){

		let contactMsgObject = new Object();
		contactMsgObject.name = $("#first_name_input").val() + " " + $("#last_name_input").val();
		contactMsgObject.email = $("#email_input").val()
		contactMsgObject.message = $("#message_input").val()
		contactMsgObject.grescore = $("#gre_score").val()
		contactMsgObject.toeflscore = $("#toefl_score").val()
		contactMsgObject.ieltsscore = $("#ielts_score").val()
		contactMsgObject.cgpascore = $("#cgpa_score").val()
		contactMsgObject.phonenumber = $("#phone_number").val()
		// alert(JSON.stringify(contactMsgObject));

		$.ajax({
			url: "/api/createcontactmsg",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify(contactMsgObject),
			success: (res) => {
				alert("Reply Submitted successfully");
			},
			error: (res) => {
				alert("Internal server error");
			},
			complete: window.location.reload()
		})
	}
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
