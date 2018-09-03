const userElementTemplate = $("#user_element_template").html();
const selectedUserCountSpan = $(".selected-user-count");
const userTypeSelector = $(".user-type-selector-wraper");
let checkedUsers = new Array();


function ajaxAndFillUsers(type) {
	let url = `/api/getusers/${type}`
	$.ajax({
		url: url,
		type: "get",
		success: (res) => {
			fillUserElements(res);
		},
		error: (res) => {
			alert("Internal Server Error");
		}
	});
}


function fillUserElements(users) {
	if (!users.length) {
		$(".user-list-wrapper").html("<center><h4>No users of this type</h4><center>");
		return;
	} else {
		$(".user-list-wrapper").html("");
	}

	let renderedTemplate;
	let checked;

	users.forEach((user) => {

		if (checkedUsers.includes(user.username)) {
			checked = true;
		} else {
			checked = false;
		}

		let currentTime = new Date();
	  let year = currentTime.getFullYear();
	  let formattedTime;
	  if(year == moment(user.userCreatedAt).year()){
	    formattedTime = moment(user.userCreatedAt).format('HH:mm on DD-MMM');
	  }else{
	    formattedTime = moment(user.userCreatedAt).format('HH:mm on DD-MMM-YYYY ');
	  }

		renderedTemplate = Mustache.render(userElementTemplate, {
			username: user.username,
			name: user.fullName,
			email: user.email,
			createdAt: formattedTime,
			location: user.location,
			posts: user.posts,
			upvotes: user.votes,
			checked: checked
		});
		$(".user-list-wrapper").append(renderedTemplate);
		if(user.blocked){
			$('.unblock').fadeIn('fast');
		}else{
			$('.block').fadeIn('fast');
		}

	});



	$("input[type=checkbox]").on("change", function() {
		let username = $(this).parent().attr("id");
		if ($(this).is(":checked")) {
			addCheckedUser(username);
		} else {
			removeCheckedUser(username)
		}
	})

	$('.block').on('click', function() {
		let username = $(this).parent().parent().attr("id");
		var answer = confirm("Block this user?");
    if (answer == true) {
			$.ajax({
				url: "/api/admin/blockuser/"+username,
				type: "post",
				success: function(res) {

				},
				error: function(res) {
					alert("Internal server error");
				},
				confirm: window.location.reload()
			});
    }
    else {

    }

	})

	$('.unblock').on('click', function() {
		let username = $(this).parent().parent().attr("id");
		var answer = confirm("unblock this user?");
    if (answer == true) {
			$.ajax({
				url: "/api/admin/unblockuser/"+username,
				type: "post",
				success: function(res) {

				},
				error: function(res) {
					alert("Internal server error");
				},
				confirm: window.location.reload()
			});
    }
    else {

    }

	})
}

function addCheckedUser(username) {
	if (!checkedUsers.includes(username)) {
		checkedUsers.push(username);
	}
	selectedUserCountSpan.html(checkedUsers.length)
	userTypeSelector.show();
}

function removeCheckedUser(username) {
	let index = checkedUsers.indexOf(username);
	if (index != -1) {
		checkedUsers.splice(index,1);
	}
	selectedUserCountSpan.html(checkedUsers.length)
	if (!checkedUsers.length) {
		userTypeSelector.hide();
	}
}

let userTypeSelectorOnChangeHandler = function() {
	let optionId = $("#user_type_selector option:selected").val();
	if (optionId == 0 || !confirm("Are you sure you want to change type of " + checkedUsers.length + " to " + optionId + "?")) {
		$("#user_type_selector").val(0);
		return;
	}

	let data = new Object();
	data.users = checkedUsers;
	data.type = optionId;

	$.ajax({
		url: "/api/changeusertype",
		type: "post",
    	contentType: "application/json",
		data: JSON.stringify(data),
		success: function(res) {
			alert(checkedUsers.length + " members modified successfully");
		},
		error: function(res) {
			alert("Internal server error");
		},
		confirm: window.location.reload()
	});
}

$(document).ready(function() {
	ajaxAndFillUsers($("input[name=user_type]:checked").val());

	$("input[name=user_type]").on("change", function() {
		ajaxAndFillUsers($(this).val())
	})

	$("#user_type_selector").on("change", userTypeSelectorOnChangeHandler);
})
