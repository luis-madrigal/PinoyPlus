$(() => {
    $(".footer").fadeIn(125, () => {
        $("#large-text").fadeIn(250);
        $("#sub-text").fadeIn(375, () => {
            $("#login-form").fadeIn(125);
        });
    });
});
$(() => {
    function startLogin() {
        $("#error").text("");
        $("#submit").text("Loading...");
        $("#submit").attr("disabled", "disabled");
    }
    function resetLogin(errorMsg) {
        $("#error").text(errorMsg || "");
        $("#submit").text("Log In");
        $("#submit").removeAttr("disabled");
    }
    const chatServerUrl = $("#chatServerUrl").val() + "";
    $("#chatServerUrl").remove();
    const conn = new Strophe.Connection(chatServerUrl);
    $("#submit").click(() => {
        let username = $("#username_input").val();
        if (!username) {
            resetLogin("Username is missing");
            return;
        }
        let password = $("#password_input").val();
        if (!password) {
            resetLogin("Password is missing");
            return;
        }
        conn.connect(username, password, (status, condition) => {
            if (status == Strophe.Status.ERROR) {
                console.log("An internal error occured");
                resetLogin("An error occured");
            }
            else if (status == Strophe.Status.CONNECTING) {
                console.log("Connecting...");
                startLogin();
            }
            else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
                console.log("Username and Password combination does not exist");
                resetLogin("Invalid username or password");
            }
            else if (status == Strophe.Status.CONNTIMEOUT) {
                console.log("No internet or server is not available");
                resetLogin("No connection");
            }
            else if (status == Strophe.Status.DISCONNECTED) {
                console.log("Disconnected");
                resetLogin("");
            }
            else if (status == Strophe.Status.CONNECTED) {
                console.log("Account Verified");
                resetLogin("");
                let url = window.location.origin + "/storage";
                $.ajax({
                    url: url,
                    type: 'post',
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(() => {
                    console.log("Successful Login");
                    conn.disconnect("");
                    window.location.pathname = "/";
                }).fail(e => {
                    console.log("Error Login");
                    resetLogin("No connection");
                });
            }
        });
    });
});
