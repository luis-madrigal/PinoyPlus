// Constants

const c = {
    jid: "",
    password: "",
    jidOther: ""
}
$(document).ready(() => {
    c.jid = $("#jid").val()
    c.password = $("#password").val()
    c.jidOther = $("#jid-other").val()

    console.log("Channel Info")
    console.log(c)
})


// UI

var prevChatFromUser = true;
var conversantMessage = '<div class = "row message-container conversant-message">' +
    '<div class = "col-lg-1">' +
    '<img class = "img-responsive" src = "img/face.png">' +
    '</div>' +
    '<div class = "col-lg-7 messages">' +
    '</div>' +
    '</div>';
var userMessage = '<div class = "row message-container user-message">' +
    '<div class = "col-lg-4"></div>' +
    '<div class = "col-lg-7 messages">' +
    '</div>' +
    '<div class = "col-lg-1">' +
    '<img class = "img-responsive" src = "img/face.png">' +
    '</div>' +
    '</div>';

$(document).ready(function () {
    $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);

    $("#chat-input-text").keypress(function (e) {
        if (e.which == KeyCodes.ENTER) {
            var str = $(this).val();
            if (str.trim()) {
                logMessage(true, str)
                sendMessage(str + " niggaaaa")
                $(this).val("");
            }
            e.preventDefault();
            return false;
        }
    })
})

// Server

const BOSH_SERVICE = "ws://localhost:5280/ws/"
const conn = new Strophe.Connection(BOSH_SERVICE)

const debug = true
if (debug) {
    conn.xmInput = function (data) {
        console.warn("RECV")
        console.warn(data);
    }
    conn.xmlOutput = function (data) {
        console.warn("SEND")
        console.warn(data);
    }
}

$(document).ready(() => {

    conn.connect(c.jid, c.password, status => {
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

            conn.send($pres())

            console.log("Success")
            // Set roster
            conn.roster.init(conn)

            // Set handlers
            console.log("Register handler")
            conn.addHandler(onMessage, null, 'message', null, null, null);
            // conn.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
            // conn.addHandler(onPresence, null, "presence");
        }
        if (status == Strophe.Status.CONNTIMEOUT) {
            console.log("No internet")
        }
    })
})


// Function

function logMessage(fromUser, str) {
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

function sendMessage(content) {
    var msg = $msg({
            from: c.jid,
            to: c.jidOther,
            type: "chat"
        })
        .c("body")
        .t(content)
    conn.send(msg)
}

function onMessage(msg) {
    var me = c.jid
    var from = Strophe.getBareJidFromJid($(msg).attr("from"))
    var to = Strophe.getBareJidFromJid($(msg).attr("to"))

    console.log("From: " + from + " To: " + to + " Me: " + me)
    console.log(msg)

    if (to == me || from == me) {
        var body = $(msg).find("body").text()
        logMessage(me == from, body)
    }

    return true
}

// Function - Not used

// callback(member, index)
function getRoster(callback) {
    conn.roster.get(roster => {
        for (var i in roster) {
            var member = roster[i]
            callback(member, i)
            // console.log({
            //     i: i,
            //     name: member.name,
            //     jid: member.jid,
            //     subscription: member.subscription,
            //     groups: member.groups
            // })
        }
    })
}

// Tests

// Archive
function test(jid, message) {
    console.log("USER: " + jid)
    console.log(message)
}
// connection.archive.listCollections(c.jid, null, function (collections, responseRsm) {
//     //Loop the collections
//     for (var int = 0; int < collections.length; int++) {
//         var lastCollection = collections[int];
//         rsm = new Strophe.RSM({});
//         lastCollection.retrieveMessages(rsm, function (messages, responseRsm) {
//             test(fullJID, messages);
//         });
//     }
// });

// $("#edit-profile").click(() => {
//     console.log("Archiving...")
//     conn.archive.listCollections(c.jid, null, function (collections, responseRsm) {
//         //Loop the collections
//         for (var int = 0; int < collections.length; int++) {
//             var lastCollection = collections[int];
//             rsm = new Strophe.RSM({});
//             lastCollection.retrieveMessages(rsm, function (messages, responseRsm) {
//                 test(fullJID, messages);
//             });
//         }
//     });
// })

// Get Message History
var other = c.jidOther + ""
var mamQuery = {
    with: "user1@localhost",
    max: 5,
    before: '',
    onMessage: msg => {
        console.warn(msg);
        return true;
    },
    onComplete: () => {
        console.log("Got all the messages");
    }
}

$("#edit-profile").click(() => {
    console.log(c)
    conn.mam.query(c.jid, mamQuery)

    // var query = $iq({
    //         type: 'set',
    //         id: '12345678'
    //     }).c('query', {
    //         xmlns: 'urn:xmpp:mam:1'
    //     }).c("x", {
    //         xmlns: "jabber:x:data",
    //         type: "submit"
    //     }).c("field", {
    //         var: "FORM_TYPE",
    //         type: "hidden"
    //     }).c("value", {}, "urn:xmpp:mam:1")
    //     .up()
    //     .c("field", {
    //         var: "with",
    //     }).c("value", {}, "user1@localhost")
    //     .up().up()
    //     .c("set", {
    //         xmlns: 'http://jabber.org/protocol/rsm'
    //     }).c("max", {}, 10)
    //     .c("before");

    // console.log(query.toString())
    // conn.sendIQ(query)
})

// Get Roster
// $("#edit-profile").click(() => {
//     getRoster((m, i) => {
//         console.log("Friend " + i)
//         console.log(m)
//     })
// })