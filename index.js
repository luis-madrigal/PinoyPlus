"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MemcachedStore = require("connect-memcached")(session);
const config_1 = require("./config");
const app = express();
// Rendering Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// Encoding Handlers
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());
// Session
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: config_1.default.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    }
}));
// Cross-origin
app.use(cors({
    credentials: true,
    origin: true
}));
// Public Files
app.use('/', express.static("res"));
app.set('views', path.join(__dirname, 'views'));
// This section has pages that doesn't need login
app.get('/init', (req, res) => {
    res.render("init.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost
    });
});
// The login/dashboard page
app.get('/', (req, res) => {
    let auth = req.session;
    if (!(auth && auth.username && auth.password)) {
        res.render("login.html", {
            chatServerUrl: config_1.default.chatServerUrl
        });
        return;
    }
    res.render("dashboard.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
// This guards that the links beyond this can only be accessed if logged in
app.get("*", (req, res, next) => {
    let auth = req.session;
    if (!(auth && auth.username && auth.password)) {
        res.redirect("/");
        return;
    }
    next();
});
app.get('/announcements', (req, res) => {
    let auth = req.session;
    res.render("announcements-main.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
app.get('/threads', (req, res) => {
    let auth = req.session;
    res.render("announcements-thread.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
app.get('/posts', (req, res) => {
    let auth = req.session;
    res.render("announcements-post.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
app.get('/feedback', (req, res) => {
    let auth = req.session;
    res.render("feedback.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
app.get("/about", (req, res) => {
    let auth = req.session;
    res.render("about.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
app.get("/database", (req, res) => {
    let auth = req.session;
    res.render("database.html", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
// Redirects to the login page if 
app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
});
app.post("/storage", (req, res) => {
    console.log(jsonCircle(req.body, 4));
    let content = req.body || {};
    for (let key in content) {
        req.session[key] = content[key] || "";
    }
    res.json({
        status: 200
    });
});
app.listen(config_1.default.port, () => console.log('Listening on port ' + config_1.default.port + '!'));
function jsonCircle(obj, spacing) {
    var cache = [];
    var str = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                }
                catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, spacing);
    cache = null;
    return str;
}
