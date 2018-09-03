const messageElementTemplate = $("#message_element_template").html();

function ajaxAndFillMessages(type) {
	let url = "/api/get"+type+"contactmsg";
	$.ajax({
		url: url,
		type: "get",
		success: (res) => {
			fillMessages(res, type);
		},
		error: (res) => {
			alert("Internal server error");
		}
	})
}

function fillMessages(messages, type) {
	let renderedTemplate;
	$(".message-list").html("");


	messages.forEach((message) => {
		let currentTime = new Date();
	  let year = currentTime.getFullYear();
	  let formattedTime;
	  if(year == moment(message.createdAt).year()){
	    formattedTime = moment(message.createdAt).format('HH:mm on DD-MMM');
	  }else{
	    formattedTime = moment(message.createdAt).format('HH:mm on DD-MMM-YYYY ');
	  }
		renderedTemplate = Mustache.render(messageElementTemplate, {
			id: message._id,
			name: message.name,
			email: message.email,
			gre: message.gre,
			toefl: message.toefl,
			ielts: message.ielts,
			phone: message.phone,
			cgpa: message.cgpa,
			createdAt: formattedTime,
			message: message.message,
			read: (type === "read")?true:false
		});
		$(".message-list").append(renderedTemplate);
	});

	$(".mark-read").on("click", function() {
		markReadUnreadOnClickHandler($(this).parent().parent().parent().attr("id"),true);
	});

	$(".mark-unread").on("click", function() {
		markReadUnreadOnClickHandler($(this).parent().parent().parent().attr("id"),false);
	});

	$(".delete-button").on("click", function() {
		if (confirm("Delete message?")) {
			deleteOnClickHandler($(this).parent().parent().parent().attr("id"));
		}
	});
}

let markReadUnreadOnClickHandler = function(messageId, read) {
	let data = {
		messageId: messageId,
		readByAdmin: read
	}
	console.log(data)
	$.ajax({
		url: "/api/markcontactmsg",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: (res) => {
			alert("Message marked as "+((read == true)?"read":"unread"));
		},
		error: (res) => {
			alert("Internal server error");
		},
		complete: window.location.reload()
	});
}

let deleteOnClickHandler = function(messageId) {
	let data = {
		messageId: messageId,
	}
	$.ajax({
		url: "/api/admin/deletecontactmessage",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: (res) => {
			$("#"+messageId).remove();
		},
		error: (res) => {
			alert("Internal server error");
		}
	});
}

$(document).ready(function() {
	ajaxAndFillMessages($("input[name=read_unread_radio]:checked").val());

	$("input[name=read_unread_radio]").on("change", function() {
		ajaxAndFillMessages($(this).val())
	})
})
