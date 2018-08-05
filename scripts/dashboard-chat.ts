const DASHBOARD_CHAT = {
    username: "",
    currentlyChatting: "user1@localhost",
    currentlyChattingNick: "User1",
    conn: <Strophe.Connection>null,
    admin: <Admin>null,
    logMessage: (fromUser: boolean, content: string) => { console.error("Function logMessage is not yet initialized") },
    sendMessage: (to: string, content: string) => { console.error("Function sendMessage is not yet initialized") }
}

$(() => {
    DASHBOARD_CHAT.logMessage = (fromUser: boolean, content: string) => {
        const lastMsgFromUser = $(".chat-container").children().last().hasClass("user-message");

        console.log(`Log Message (fromUser=${fromUser} lastMsgFromUser=${lastMsgFromUser} content=${content}`)

        if (fromUser && !lastMsgFromUser) {
            $(".chat-container").append(`
            <div class="row message-container user-message">
                <div class="col-lg-4"></div>
                <div class="col-lg-7 messages"></div>
                <div class="col-lg-1">
                    <img class="img-responsive" src="img/face.png">
                </div>
            </div>
            `);
        } else if (!fromUser && lastMsgFromUser) {
            $(".chat-container").append(`
            <div class="row message-container conversant-message">
                <div class="col-lg-1">
                    <img class="img-responsive" src="img/face.png">
                </div>
                <div class="col-lg-7 messages"></div>
            </div>
            `);
        }

        $($(".chat-container").children().last()).find(".messages").append('<p class = "message">' + content + '</p>');
        $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
    }
    DASHBOARD_CHAT.sendMessage = (to: string, content: string) => {
        var msg = $msg({
            from: DASHBOARD_CHAT.username,
            to: to,
            type: "chat"
        }).c("body").t(content)
        DASHBOARD_CHAT.conn.send(msg)
    }
})

$(() => {
    const adminAccount = $("#adminAccount").val() + ""
    const adminServerUrl = $("#adminServerUrl").val() + ""
    const chatServerUrl = $("#chatServerUrl").val() + ""
    const chatHost = $("#chatHost").val() + ""
    const username = DASHBOARD_CHAT.username = $("#username").val() + ""
    const password = $("#password").val() + ""

    $("#adminAccount").remove()
    $("#adminServerUrl").remove()
    $("#chatServerUrl").remove()
    $("#chatHost").remove()
    $("#username").remove()
    $("#password").remove()

    const admin = DASHBOARD_CHAT.admin = new Admin(adminServerUrl)
    const conn = new Strophe.Connection(chatServerUrl)

    admin.cmd("get_roster", {
        user: username.substring(0, username.lastIndexOf("@")),
        server: username.substring(username.lastIndexOf("@") + 1)
    }).then(e => {
        if (e.error) {
            console.error(e.message)
            console.error(e.content)
            return;
        }
        for (let f of e.content) {
            const name = f.nick
            const jid = f.jid
            DASHBOARD_CHAT.currentlyChatting = jid
            DASHBOARD_CHAT.currentlyChattingNick = name

            const body = `
			<div class="contact-item" id="${jid.replace("@", "-")}">
                <div class="row">
                    <div class="col-sm-9">
                    </div>
                    <div class="col-sm-3 time">
                        <p>4:15pm</p>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <img class="img-responsive" src="img/face.png">
                    </div>
                    <div class="col-sm-8">
                        <div class="row contact-name">
                            <p>${name}</p>
                        </div>
                        <!-- LAST MESSAGE -->
                        <div class="row contact-message">
                            <p>Kamusta naman yung mga...</p>
                        </div>
                    </div>
                </div>
            </div>
            `
            $(".chat-list-container").append(body)

            $('#' + jid.replace("@", "-")).click(function (e) {
                $('.chat-list-container').css('display', 'none');
                $('.main-chat-container').css('display', 'block');

                console.log("Load Chat Log Between " + username + " and " + jid)
                DASHBOARD_CHAT.conn["mam"].query(username, {
                    with: jid,
                    max: 1000,
                    before: '',
                    onMessage: msg => {
                        console.log(msg || "");
                        return true;
                    },
                    onComplete: () => {
                        console.log("Chat Log  Loaded Between " + username + " and " + jid);
                    }
                })
            });
        }
    })

    conn.connect(username, password, status => {
        if (status == Strophe.Status.ERROR) {
            console.error("An internal error occured")
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.error("Connection disconnected")
        } else if (status == Strophe.Status.CONNTIMEOUT) {
            console.error("No internet")
        } else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
            console.error("Username and Password combination does not exist")
        } else if (status == Strophe.Status.CONNECTING) {
            console.log("Connecting...")
        } else if (status == Strophe.Status.CONNECTED) {
            DASHBOARD_CHAT.conn = conn

            console.log("Connected")

            console.log("Sending Presence (Online)")
            conn.send($pres())

            console.log("Initializing Plugin (Strophe.roster)")
            conn["roster"].init(conn)

            console.log("Initializing Handlers")
            conn.addHandler(msg => {
                var me = username
                var from = Strophe.getBareJidFromJid($(msg).find("message").attr("from"))
                var to = Strophe.getBareJidFromJid($(msg).find("message").attr("to"))

                console.log("Message recieved (From: " + from + " To: " + to + " Me: " + me + ")")
                console.log(msg)

                if (to == me || from == me) {
                    var body = $(msg).find("body").text()
                    DASHBOARD_CHAT.logMessage(me == from, body)
                }

                return true
            }, null, 'message', null, null, null);
            // conn.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
            // conn.addHandler(onPresence, null, "presence");



        }
    })
})

$(() => {
    $("#chat-input-text").keypress(e => {
        let self = $("#chat-input-text")
        if (e.which == KeyCodes.ENTER) {
            let str = self.val() + "";
            if (str.trim()) {
                DASHBOARD_CHAT.logMessage(true, str)
                DASHBOARD_CHAT.sendMessage(DASHBOARD_CHAT.currentlyChatting, str + "")
                self.val("");
            }
            e.preventDefault();
            return false;
        }
    })

    $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
})
