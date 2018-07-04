const BOSH_SERVICE = "http://localhost:5280/bosh/"
const conn = new Strophe.Connection(BOSH_SERVICE)

conn.xmInput = function (data) {
	console.warn("RECV")
	console.warn(data);
}
conn.xmlOutput = function (data) {
	console.warn("SEND")
	console.warn(data);
}

$(document).ready(() => {
	$(".footer").fadeIn(125, () => {
		$("#large-text").fadeIn(250)
		$("#sub-text").fadeIn(375, () => {
			$("#login-form").fadeIn(125)
		})
	})

	$("#submit").click(() => {
		let username = $("#username_input").val() || ""
		let password = $("#password_input").val() || ""
		conn.connect(username, password, (status, condition) => {
			if (status == Strophe.Status.ERROR) {
				console.log("An internal error occured")
				$("#error").text("An error occured")
			}
			if (status == Strophe.Status.CONNECTING) {
				console.log("Connecting...")
				$("#submit").text("Loading...")
			}
			if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
				console.log("Username and Password combination does not exist")
				$("#error").text("Invalid username or password")
			}
			if (status == Strophe.Status.CONNECTED || status == Strophe.Status.DISCONNECTED) {
				console.log("Stop Loading")
				$("#submit").text("Log In")
			}
			if (status == Strophe.Status.CONNECTED) {
				console.log("Success: Redirect")
				conn.disconnect()
				// window.location.href = "/chat"
				// TODO pass parameters to the route
			}
			if (status == Strophe.Status.CONNTIMEOUT) {
				console.log("No internet")
				$("#error").text("No connection")
			}
		})
	})
})