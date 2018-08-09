import express = require('express')
import session = require('express-session')

import config from "./config"
import * as utils from "./scripts/server-utils"

const app = express()

// Rendering Engine
app.set('view engine', 'ejs')

// Encoding Handlers
app.use(express.json());
app.use(express.urlencoded());

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

app.post("/storage", (req, res) => {
    console.log(utils.jsonCircle(req.body, 4))
    let content = req.body || {}
    for (let key in content) {
        req.session[key] = content[key] || ""
    }
    res.json({
        status: 200
    })
})


/* ************************************
 * 
 * START LISTENING
 * 
 * ************************************/
app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
