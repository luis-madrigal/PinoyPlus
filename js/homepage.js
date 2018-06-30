var prevChatFromUser = true;
var conversant_message = '<div class = "row message-container conversant-message">' +
								'<div class = "col-lg-1">' +
									'<img class = "img-responsive" src = "res/img/face.png">' +
								'</div>' +
								'<div class = "col-lg-7 messages">' +
								'</div>' +
							'</div>';
var user_message =  '<div class = "row message-container user-message">' +
								'<div class = "col-lg-4"></div>' +
								'<div class = "col-lg-7 messages">' +
								'</div>' +
								'<div class = "col-lg-1">' +
									'<img class = "img-responsive" src = "res/img/face.png">' +
								'</div>' +
							'</div>';

$(document).ready(function () {
	$(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
})

$("#chatInputText").keypress(function(e) {
	if(e.which == 13) {
		var str = $(this).val();
		if(str.trim()) {
			// $(".user-message > .messages").append('<p class = "message">'+ str +'</p>');
			// $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
			addMessage(true, str);
			$(this).val("");
		}
		e.preventDefault();
		return false;
	}
	if(e.which == 112) {
		console.log(str);
		var str = $(this).val();
		if(str.trim()) {
			addMessage(false, str);
			$(this).val("");
		}
		e.preventDefault();
		return false;
	}
})

function addMessage(fromUser, str) {
	var lastMsgFromUser = $(".chat-container").children().last().hasClass("user-message");
	console.log(lastMsgFromUser);
	if(fromUser && !lastMsgFromUser) {
		$(".chat-container").append(user_message);
	} else if(!fromUser && lastMsgFromUser) {
		$(".chat-container").append(conversant_message);
	}

	$($(".chat-container").children().last()).find(".messages").append('<p class = "message">'+ str +'</p>');
	$(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
}