const DASHBOARD_CHAT = {
    defaultImg: "img/face.png",
    username: "",
    userImg: "img/face.png",
    otherImg: "img/face.png",
    otherName: "user1@localhost",
    otherNick: "User1",
    conn: null,
    admin: null,
    adminAccount: "admin@pinoyplus",
    adminServerUrl: "",
    logMessage: (fromUser, content) => { console.error("Function logMessage is not yet initialized"); },
    sendMessage: (to, content) => { console.error("Function sendMessage is not yet initialized"); }
};
$(() => {
    DASHBOARD_CHAT.logMessage = (fromUser, content) => {
        const lastMsgFromUser = $(".chat-container").children().last().hasClass("user-message");
        console.log(`Log Message (fromUser=${fromUser} lastMsgFromUser=${lastMsgFromUser} content=${content}`);
        if (fromUser && !lastMsgFromUser) {
            $(".chat-container").append(`
            <div class="row message-container user-message">
                <div class="col-lg-4"></div>
                <div class="col-lg-7 messages"></div>
                <div class="col-lg-1">
                    <img class="img-responsive" src="${DASHBOARD_CHAT.userImg || DASHBOARD_CHAT.defaultImg}">
                </div>
            </div>
            `);
        }
        else if (!fromUser && lastMsgFromUser) {
            $(".chat-container").append(`
            <div class="row message-container conversant-message">
                <div class="col-lg-1">
                    <img class="img-responsive" src="${DASHBOARD_CHAT.otherImg || DASHBOARD_CHAT.defaultImg}">
                </div>
                <div class="col-lg-7 messages"></div>
            </div>
            `);
        }
        $($(".chat-container").children().last()).find(".messages").append('<p class = "message">' + content + '</p>');
        $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
    };
    DASHBOARD_CHAT.sendMessage = (to, content) => {
        var msg = $msg({
            from: DASHBOARD_CHAT.username,
            to: to,
            type: "chat"
        }).c("body").t("<span class='actual-content'>" + content + "</span>" + "<span hidden class='hidden-timestamp'>" + new Date().toISOString() + "</span>");
        DASHBOARD_CHAT.conn.send(msg);
    };
});
$(() => {
    const adminAccount = DASHBOARD_CHAT.adminAccount = $("#adminAccount").val() + "";
    const adminServerUrl = DASHBOARD_CHAT.adminServerUrl = $("#adminServerUrl").val() + "";
    const chatServerUrl = $("#chatServerUrl").val() + "";
    const chatHost = $("#chatHost").val() + "";
    const username = DASHBOARD_CHAT.username = $("#username").val() + "";
    const password = $("#password").val() + "";
    $("#adminAccount").remove();
    $("#adminServerUrl").remove();
    $("#chatServerUrl").remove();
    $("#chatHost").remove();
    $("#username").remove();
    $("#password").remove();
    const admin = DASHBOARD_CHAT.admin = new Admin(adminServerUrl);
    const conn = new Strophe.Connection(chatServerUrl);
    function getTime(d) {
        let amOrPm = (d.getHours() < 12) ? "AM" : "PM";
        let hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;
        let mins = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        return hour + ':' + mins + ' ' + amOrPm;
    }
    function getLastMessages(jid, count, onMsg, onFin) {
        const waitForLoading = setInterval(() => {
            var lastMessage;
            if (DASHBOARD_CHAT.conn) {
                clearInterval(waitForLoading);
                DASHBOARD_CHAT.conn["mam"].query(username, {
                    with: jid,
                    max: count,
                    before: '',
                    onMessage: msg => {
                        lastMessage = msg;
                        if (onMsg) {
                            onMsg(msg);
                        }
                        return true;
                    },
                    onComplete: () => {
                        console.log("Chat Log  Loaded Between " + username + " and " + jid);
                        if (onFin) {
                            onFin(lastMessage);
                        }
                    }
                });
            }
        }, 300);
    }
    admin.getDesc(username).then((r) => {
        DASHBOARD_CHAT.userImg = r.content.img;
        $(".welcome-text").text("Welcome back, " + r.content.name);
    });
    admin.getRoster(username).then(e => {
        if (e.error) {
            console.error(e.message);
            console.error(e.content);
            return;
        }
        let p = Promise.resolve({});
        for (let f of e.content) {
            p = p.then(() => admin.getDesc(f.jid)).then(r => {
                const name = f.nick;
                const jid = f.jid;
                DASHBOARD_CHAT.otherName = jid;
                DASHBOARD_CHAT.otherNick = name;
                DASHBOARD_CHAT.otherImg = r.content.img;
                const jid_id = jid.replace("@", "-");
                $(".chat-list-container").append(`
                <div class="contact-item" id="${jid_id}">
                    <div class="row">
                        <div class="col-sm-9">
                        </div>
                        <div class="col-sm-3 time">
                            <p id="${jid_id + "-time"}">N/A</p>
                        </div>
    
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <img class="img-responsive" src="${r.content.img}">
                        </div>
                        <div class="col-sm-8">
                            <div class="row contact-name">
                                <p>${name}</p>
                            </div>
                            <!-- LAST MESSAGE -->
                            <div class="row contact-message">
                                <p id="${jid_id + "-lmsg"}">Start a Conversation</p>
                            </div>
                        </div>
                    </div>
                </div>
                `);
                $('#' + jid_id).click(function (e) {
                    DASHBOARD_CHAT.otherName = jid;
                    DASHBOARD_CHAT.otherImg = r.content.img;
                    $('.chat-list-container').css('display', 'none');
                    $('.main-chat-container').css('display', 'block');
                    $('.chat-container').empty();
                    // $(".chat-container").append(`
                    //     <div class="row message-container conversant-message">
                    //         <div class="col-sm-1">
                    //             <img class="img-responsive" src="${r.content.img}">
                    //         </div>
                    //         <div class="col-sm-7 messages">
                    //             <p hidden class="message">asddddddddd</p>
                    //         </div>
                    //     </div>
                    //     <div class="row message-container user-message">
                    //         <div class="col-sm-4"></div>
                    //         <div class="col-sm-7 messages">
                    //             <p hidden class="message">asddddddddd</p>
                    //         </div>
                    //         <div class="col-sm-1">
                    //             <img class="img-responsive" src="${DASHBOARD_CHAT.userImg}">
                    //         </div>
                    //     </div>
                    // `)
                    console.log("Load Chat Log Between " + username + " and " + jid);
                    getLastMessages(jid, 1000, msg => console.log("MSG", msg), lmsg => console.log("LMSG", lmsg));
                    // const waitForLoading = setInterval(() => {
                    //     var lastMessage
                    //     if (DASHBOARD_CHAT.conn) {
                    //         clearInterval(waitForLoading)
                    //         DASHBOARD_CHAT.conn["mam"].query(username, {
                    //             with: jid,
                    //             max: 1000,
                    //             before: '',
                    //             onMessage: msg => {
                    //                 lastMessage = msg
                    //                 console.log(msg || "");
                    //                 return true;
                    //             },
                    //             onComplete: () => {
                    //                 console.log("Chat Log  Loaded Between " + username + " and " + jid);
                    //                 if (lastMessage) {
                    //                     let str = $(lastMessage).find("delay").attr("stamp")
                    //                     let date = new Date(str)
                    //                     $(jid_id + "-time").text(getTime(date))
                    //                 }
                    //             }
                    //         })
                    //     }
                    // }, 300)
                });
                return {
                    jid_id: jid_id,
                    jid: jid
                };
            }).then(r => {
                return new Promise((resolve, reject) => {
                    let isDone = false;
                    getLastMessages(r.jid, 1, msg => {
                        console.log("FTIME", msg);
                        if (msg && !isDone) {
                            isDone = true;
                            let body = "<div>" + $(msg).find("body").text() + "</div>";
                            let filteredText = $(body).find(".actual-content").text();
                            let hiddenDate = $(body).find(".hidden-timestamp").text();
                            let date = new Date(hiddenDate);
                            console.warn(body);
                            console.warn(filteredText);
                            console.warn(hiddenDate);
                            console.warn(date.toISOString());
                            console.warn(getTime(date));
                            $("#" + r.jid_id + "-time").text(getTime(date));
                            $("#" + r.jid_id + "-lmsg").text(filteredText);
                        }
                    }, lmsg => {
                        resolve();
                    });
                });
            });
        }
    });
    conn.connect(username, password, status => {
        if (status == Strophe.Status.ERROR) {
            console.error("An internal error occured");
        }
        else if (status == Strophe.Status.DISCONNECTED) {
            console.error("Connection disconnected");
        }
        else if (status == Strophe.Status.CONNTIMEOUT) {
            console.error("No internet");
        }
        else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
            console.error("Username and Password combination does not exist");
        }
        else if (status == Strophe.Status.CONNECTING) {
            console.log("Connecting...");
        }
        else if (status == Strophe.Status.CONNECTED) {
            DASHBOARD_CHAT.conn = conn;
            console.log("Connected");
            console.log("Sending Presence (Online)");
            conn.send($pres());
            console.log("Initializing Handlers");
            conn.addHandler(msg => {
                var me = username;
                var from = Strophe.getBareJidFromJid($(msg).find("message").attr("from"));
                var to = Strophe.getBareJidFromJid($(msg).find("message").attr("to"));
                console.log(msg);
                if (from != null && to != null) {
                    // This is an IQ Stanza (query message) for retrieving 
                    console.log("Message History recieved (From: " + from + " To: " + to + " Me: " + me + ")");
                }
                else {
                    // This is for normal messages
                    from = Strophe.getBareJidFromJid($(msg).attr("from"));
                    to = Strophe.getBareJidFromJid($(msg).attr("to"));
                    if (from != DASHBOARD_CHAT.otherName && to != DASHBOARD_CHAT.otherName) {
                        // If the message is not from the one you are currently chatting
                        // Then don't log it
                        return true;
                    }
                    console.log("Message History recieved (From: " + from + " To: " + to + " Me: " + me + ")");
                }
                var body = $(msg).find("body").text();
                DASHBOARD_CHAT.logMessage(me == from, body);
                return true;
            }, null, 'message', null, null, null);
            // conn.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
            // conn.addHandler(onPresence, null, "presence");
        }
    });
});
$(() => {
    $("#chat-input-text").keypress(e => {
        let self = $("#chat-input-text");
        if (e.which == KeyCodes.ENTER) {
            let str = self.val() + "";
            if (str.trim()) {
                DASHBOARD_CHAT.logMessage(true, str);
                DASHBOARD_CHAT.sendMessage(DASHBOARD_CHAT.otherName, str + "");
                self.val("");
            }
            e.preventDefault();
            return false;
        }
    });
    $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
});
