var KeyCodes = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE: 19,
	CAPS_LOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	INSERT: 45,
	DELETE: 46,
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	LEFT_META: 91,
	RIGHT_META: 92,
	SELECT: 93,
	NUMPAD_0: 96,
	NUMPAD_1: 97,
	NUMPAD_2: 98,
	NUMPAD_3: 99,
	NUMPAD_4: 100,
	NUMPAD_5: 101,
	NUMPAD_6: 102,
	NUMPAD_7: 103,
	NUMPAD_8: 104,
	NUMPAD_9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	DECIMAL: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUM_LOCK: 144,
	SCROLL_LOCK: 145,
	SEMICOLON: 186,
	EQUALS: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FORWARD_SLASH: 191,
	GRAVE_ACCENT: 192,
	OPEN_BRACKET: 219,
	BACK_SLASH: 220,
	CLOSE_BRACKET: 221,
	SINGLE_QUOTE: 222
}

var prevChatFromUser = true;
var conversant_message = '<div class = "row message-container conversant-message">' +
	'<div class = "col-lg-1">' +
	'<img class = "img-responsive" src = "img/face.png">' +
	'</div>' +
	'<div class = "col-lg-7 messages">' +
	'</div>' +
	'</div>';
var user_message = '<div class = "row message-container user-message">' +
	'<div class = "col-lg-4"></div>' +
	'<div class = "col-lg-7 messages">' +
	'</div>' +
	'<div class = "col-lg-1">' +
	'<img class = "img-responsive" src = "img/face.png">' +
	'</div>' +
	'</div>';

$(document).ready(function () {
	$(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
})

// $("#chatInputText").keypress(function (e) {
// 	if (e.which == 13) {
// 		var str = $(this).val();
// 		if (str.trim()) {
// 			// $(".user-message > .messages").append('<p class = "message">'+ str +'</p>');
// 			// $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
// 			addMessage(true, str);
// 			$(this).val("");
// 		}
// 		e.preventDefault();
// 		return false;
// 	}
// 	if (e.which == 112) {
// 		console.log(str);
// 		var str = $(this).val();
// 		if (str.trim()) {
// 			addMessage(false, str);
// 			$(this).val("");
// 		}
// 		e.preventDefault();
// 		return false;
// 	}
// })

function addMessage(fromUser, str) {
	var lastMsgFromUser = $(".chat-container").children().last().hasClass("user-message");
	console.log(lastMsgFromUser);
	if (fromUser && !lastMsgFromUser) {
		$(".chat-container").append(user_message);
	} else if (!fromUser && lastMsgFromUser) {
		$(".chat-container").append(conversant_message);
	}

	$($(".chat-container").children().last()).find(".messages").append('<p class = "message">' + str + '</p>');
	$(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
}


const BOSH_SERVICE = "http://localhost:5280/bosh/"
const conn = new Strophe.Connection(BOSH_SERVICE)


const jid = $("#jid").val()
const password = $("#password").val()


const jidOther = $("#jid-other").val()


conn.xmInput = function (data) {
	console.warn("RECV")
	console.warn(data);
}
conn.xmlOutput = function (data) {
	console.warn("SEND")
	console.warn(data);
}


function sendMessage(content) {
	let msg = $msg({
			from: jid,
			to: jidOther,
			type: "chat"
		})
		.c("body")
		.t(content)
	conn.send(msg)
}

function loadAllMessages(handler) {

	console.log("From: " + jid)
	console.log("To: " + jidOther)

	var rsm = new Strophe.RSM({
		max: 1
	});

	// Fetch the first collection.
	conn.listCollections(jid, rsm, function (firstCollection, firstRsm) {
		for (let s in firstCollection)
			console.log(s)
		var nextRsm = firstRsm.next();
		conn.listCollections(jid, nextRsm, function (secondCollection, secondRsm) {
			// Now we have access to the secondCollection here.
		});
	});
	// conn.mam.query(from, {
	// 	with: other,
	// 	onMessage: msg => {
	// 		console.log("Message from ", $(msg).find("forwarded message").attr("from"), ": ", $(msg).find("forwarded message body").text())
	// 		return true
	// 	},
	// 	onComplete: response => {
	// 		console.log("Got all the messages")
	// 	}
	// })
}



$(document).ready(() => {

	conn.connect(jid, password, status => {
		if (status == Strophe.Status.ERROR) {
			console.log("An internal error occured")
		}
		if (status == Strophe.Status.CONNECTING) {
			console.log("Connecting...")
		}
		if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
			console.log("Username and Password combination does not exist")
		}
		if (status == Strophe.Status.CONNECTED || status == Strophe.Status.DISCONNECTED) {
			console.log("Stop Loading")
		}
		if (status == Strophe.Status.CONNECTED) {
			console.log("Success: Redirect")
		}
		if (status == Strophe.Status.CONNTIMEOUT) {
			console.log("No internet")
		}
	})
})

$("#edit-profile").click(() => {
	// conn.archive.init(conn)
	console.log("Loading")
	// loadAllMessages("user1@localhost")

})


$("#chatInputText").keypress(function (e) {
	if (e.which == KeyCodes.ENTER) {
		var str = $(this).val();
		if (str.trim()) {
			addMessage(true, str)
			sendMessage($("#jid-other").val(), str)
			$(this).val("");
		}
		e.preventDefault();
		return false;
	}
})