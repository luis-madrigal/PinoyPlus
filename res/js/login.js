const chatServerUrl = $("#chatServerUrl").val() + "";
const conn = new Strophe.Connection(chatServerUrl);
$(document).ready(() => {
    $(".footer").fadeIn(125, () => {
        $("#large-text").fadeIn(250);
        $("#sub-text").fadeIn(375, () => {
            $("#login-form").fadeIn(125);
        });
    });
    $("#submit").click(() => {
        let username = $("#username_input").val() || "";
        let password = $("#password_input").val() || "";
        conn.connect(username, password, (status, condition) => {
            if (status == Strophe.Status.ERROR) {
                console.log("An internal error occured");
                $("#error").text("An error occured");
                $("#submit").text("Log In");
            }
            else if (status == Strophe.Status.CONNECTING) {
                console.log("Connecting...");
                $("#error").text("");
                $("#submit").text("Loading...");
                $("#submit").attr("enabled", "false");
            }
            else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
                console.log("Username and Password combination does not exist");
                $("#error").text("Invalid username or password");
                $("#submit").text("Log In");
            }
            else if (status == Strophe.Status.CONNTIMEOUT) {
                console.log("No internet");
                $("#error").text("No connection");
                $("#submit").text("Log In");
            }
            else if (status == Strophe.Status.DISCONNECTED) {
                console.log("Disconnected");
                $("#error").text("");
                $("#submit").text("Log In");
            }
            else if (status == Strophe.Status.CONNECTED) {
                $("#error").text("");
                $("#submit").text("Log In");
                // window.location.href = "/chat"
                // TODO pass parameters to the route
                console.log("Account Verified");
                let url = window.location.origin + "/storage";
                $.ajax({
                    url: url,
                    type: 'post',
                    data: {
                        username: username,
                        password: password
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(() => {
                    console.log("Successful Login");
                    conn.disconnect("");
                    window.location.pathname = "/chat";
                }).fail(e => {
                    console.log(e);
                });
            }
        });
    });
});
