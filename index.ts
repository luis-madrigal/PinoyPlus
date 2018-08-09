import express = require('express')
import session = require('express-session')
import morgan = require("morgan")

import request = require('request')

import config from "./config"
import * as utils from "./scripts/server-utils"

const app = express()


// Logger
if (config.debug) {
    app.use(morgan('dev', {
        skip: function (req, res) {
            return res.statusCode < 400
        }, stream: process.stderr
    }));

    app.use(morgan('dev', {
        skip: function (req, res) {
            return res.statusCode >= 400
        }, stream: process.stdout
    }));
}

// Rendering Engine
app.set('view engine', 'ejs')

// Encoding Handlers
app.use(express.json());
app.use(express.urlencoded())

// Session
app.set('trust proxy', 1)
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    }
}))

// Public Files
app.use('/', express.static("public"))
app.set('views', "views")

// This section has pages that doesn't need login
app.get('/init', (req, res) => {
    res.render("init", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost
    })
})

/* ************************************
 * 
 * PAGES
 * 
 * ************************************/


/**
 * DEFAULT PAGE
 * The login/dashboard (default) page
 */
app.get('/', (req, res) => {
    let auth = req.session;

    if (!(auth && auth.username && auth.password)) {
        res.render("login", {
            chatServerUrl: config.chatServerUrl
        })
        return;
    }

    res.render("dashboard", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})


/**
 * ROUTE GUARD
 * This guards that the links beyond this can only be accessed if logged in
 */
app.get("*", (req, res, next) => {
    let auth = req.session;

    if (!(auth && auth.username && auth.password)) {
        res.redirect("/")
        return;
    }
    next()
})

/**
 * PAGES
 */

app.get('/announcements', (req, res) => {
    let auth = req.session;

    res.render("announcements-main", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

app.get('/threads', (req, res) => {
    let auth = req.session;

    res.render("announcements-thread", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

app.get('/posts', (req, res) => {
    let auth = req.session;

    res.render("announcements-post", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

app.get('/feedback', (req, res) => {
    let auth = req.session;

    res.render("feedback", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

app.get("/about", (req, res) => {
    let auth = req.session;

    res.render("about", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

app.get("/database", (req, res) => {
    let auth = req.session;

    res.render("database", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

/**
 * ERROR: 404
 * Redirects to the default page if path not found
 */
app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
})


/* ************************************
 * 
 * SERVICES
 * 
 * ************************************/

app.post("/login", (req, res) => {
    console.log(utils.jsonCircle(req.body, 4))
    let content = req.body

    if (!content) {
        res.status(400).send("No input provided")
        return
    }

    let username = content.username
    if (!username) {
        res.status(400).send("No username provided")
        return
    }

    let password = content.password
    if (!password) {
        res.status(400).send("No password provided")
        return
    }

    request({
        method: "POST",
        url: config.adminServerUrl + "check_password",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: utils.getUserFromJid(username),
            host: utils.getHostFromJid(username),
            password: password
        })
    }, (error, response, body) => {
        if (error) {
            res.status(500).send("Chat server is offline")
            return
        }

        if (body == "0") {
            req.session.username = username
            req.session.password = password

            res.status(200).send("Ok")
        } else {
            res.status(403).send("Invalid username or password")
        }
    });

    // $.ajax({
    //     method: "POST",
    //     url: config.adminServerUrl + "check_password",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     data: JSON.stringify({
    //         user: utils.getUserFromJid(username),
    //         host: utils.getHostFromJid(username),
    //         password: password
    //     })
    // }).done((data, textStatus, jqXHR) => {
    //     if (jqXHR.responseText == "0") {

    //         req.session.username = username
    //         req.session.password = password

    //         res.status(200).send("Ok")
    //     } else {

    //         res.status(403).send("Invalid username or password")
    //     }
    // }).fail((jqXHR, textStatus, errorThrown) => {
    //     res.status(500).send("Chat server is offline")
    // })

})
app.post("/logout", (req, res) => {
    if (!req.session.username || !req.session.username) {
        res.status(403).send("Not Logged in")
        return
    }

    delete req.session.username
    delete req.session.password
    res.status(200).send("Ok")
})


/* ************************************
 * 
 * START LISTENING
 * 
 * ************************************/
app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
