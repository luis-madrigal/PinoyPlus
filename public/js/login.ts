$(() => {
  $(".footer").fadeIn(1000, () => {
    $("#large-text").fadeIn(1000);
    $("#sub-text").fadeIn(1250, () => {
      $("#login-form").fadeIn(250);
    });
  });
});

$(() => {
  function startLogin() {
    $("#error").text("");
    $("#submit").text("Loading...");
    $("#submit").attr("disabled", "disabled");
  }
  function resetLogin(errorMsg?: string) {
    $("#error").text(errorMsg || "");
    $("#submit").text("Log In");
    $("#submit").removeAttr("disabled");
  }

  const chatServerUrl = $("#chatServerUrl").val() + "";
  $("#chatServerUrl").remove();

  const conn = new Strophe.Connection(chatServerUrl);

  $("#submit").click(() => {
    startLogin();

    let username = <string>$("#username_input").val();
    if (!username) {
      resetLogin("Username is missing");
      return;
    }

    let password = <string>$("#password_input").val();
    if (!password) {
      resetLogin("Password is missing");
      return;
    }

    let url = window.location.origin + "/login";
    $.ajax({
      url: url,
      type: "post",
      data: {
        username: username,
        password: password
      },
      xhrFields: {
        withCredentials: true
      }
    })
      .done(() => {
        console.log("Successful Login");
        // conn.disconnect("")
        window.location.pathname = "/";
      })
      .fail(e => {
        console.log("Error Login: " + e.status);
        resetLogin(e.responseText);
      });

    // conn.connect(username, password, (status, condition) => {

    //     if (status == Strophe.Status.ERROR) {
    //         console.log("An internal error occured")
    //         resetLogin("An error occured")
    //     } else if (status == Strophe.Status.CONNECTING) {
    //         console.log("Connecting...")
    //         startLogin();
    //     } else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
    //         console.log("Username and Password combination does not exist")
    //         resetLogin("Invalid username or password")
    //     } else if (status == Strophe.Status.CONNTIMEOUT) {
    //         console.log("No internet or server is not available")
    //         resetLogin("No connection")
    //     } else if (status == Strophe.Status.DISCONNECTED) {
    //         console.log("Disconnected")
    //         resetLogin("")
    //     } else if (status == Strophe.Status.CONNECTED) {
    //         console.log("Account Verified")
    //         resetLogin("")

    //         let url = window.location.origin + "/login"
    //         $.ajax({
    //             url: url,
    //             type: 'post',
    //             data: {
    //                 username: username,
    //                 password: password
    //             },
    //             dataType: "json",
    //             xhrFields: {
    //                 withCredentials: true
    //             }
    //         }).done(() => {
    //             console.log("Successful Login")
    //             conn.disconnect("")
    //             window.location.pathname = "/"
    //         }).fail(e => {
    //             console.log("Error Login")
    //             resetLogin("No connection")
    //         });
    //     }
    // })
  });
});
