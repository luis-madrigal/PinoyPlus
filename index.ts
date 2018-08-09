import path = require("path")
import express = require('express')
import session = require('express-session')
import cors = require('cors')

import config from "./config"
import * as utils from "./scripts/server-utils"

const app = express()

// Rendering Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')

// Encoding Handlers
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());

// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    }
}))

// Cross-origin
app.use(cors({
    credentials: true,
    origin: true
}))

// Public Files
app.use('/', express.static("res"))
app.set('views', path.join(__dirname, 'views'))

// This section has pages that doesn't need login
app.get('/init', (req, res) => {
    res.render("init.html", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost
    })
})


// The login/dashboard page
app.get('/', (req, res) => {
    let auth = req.session;

    if (!(auth && auth.username && auth.password)) {
        res.render("login.html", {
            chatServerUrl: config.chatServerUrl
        })
        return;
    }

    res.render("dashboard.html", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

// This guards that the links beyond this can only be accessed if logged in
app.get("*", (req, res, next) => {
    let auth = req.session;

    if (!(auth && auth.username && auth.password)) {
        res.redirect("/")
        return;
    }
    next()
})

app.get('/announcements', (req, res) => {
    let auth = req.session;

    res.render("announcements-main.html", {
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

    res.render("announcements-thread.html", {
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

    res.render("announcements-post.html", {
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

    res.render("feedback.html", {
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

    res.render("about.html", {
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

    res.render("database.html", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
})

// Redirects to the login page if 
app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
})

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

app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
