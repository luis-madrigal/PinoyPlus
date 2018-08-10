"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("request");
const config_1 = require("./config");
const utils = require("./scripts/server-utils");
exports.app = express();
exports.router = express.Router();
require("./server/module-debug");
require("./server/module-view_engine");
require("./server/module-encoding_handler");
require("./server/module-session");
require("./server/module-public_files");
require("./server/module-html_templates");
// This section has pages that doesn't need login
exports.app.get('/init', (req, res) => {
    res.render("init", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost
    });
});
/* ************************************
 *
 * PAGES
 *
 * ************************************/
/**
 * DEFAULT PAGE
 * The login/dashboard (default) page
 */
exports.app.get('/', (req, res) => {
    let auth = req.session;
    if (!(auth && auth.username && auth.password)) {
        res.render("login", {
            chatServerUrl: config_1.default.chatServerUrl
        });
        return;
    }
    res.render("dashboard", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
/**
 * ROUTE GUARD
 * This guards that the links beyond this can only be accessed if logged in
 */
exports.app.get("*", (req, res, next) => {
    let auth = req.session;
    if (!(auth && auth.username && auth.password)) {
        res.redirect("/");
        return;
    }
    next();
});
/**
 * PAGES
 */
exports.app.get('/announcements', (req, res) => {
    let auth = req.session;
    res.render("announcements-main", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
exports.app.get('/threads', (req, res) => {
    let auth = req.session;
    res.render("announcements-thread", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
exports.app.get('/posts', (req, res) => {
    let auth = req.session;
    res.render("announcements-post", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
exports.app.get('/feedback', (req, res) => {
    let auth = req.session;
    res.render("feedback", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
exports.app.get("/about", (req, res) => {
    let auth = req.session;
    res.render("about", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
exports.app.get("/database", (req, res) => {
    let auth = req.session;
    res.render("database", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
});
/**
 * ERROR: 404
 * Redirects to the default page if path not found
 */
exports.app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
});
/* ************************************
 *
 * SERVICES
 *
 * ************************************/
exports.app.post("/login", (req, res) => {
    console.log(utils.jsonCircle(req.body, 4));
    let content = req.body;
    if (!content) {
        res.status(400).send("No input provided");
        return;
    }
    let username = content.username;
    if (!username) {
        res.status(400).send("No username provided");
        return;
    }
    let password = content.password;
    if (!password) {
        res.status(400).send("No password provided");
        return;
    }
    request({
        method: "POST",
        url: config_1.default.adminServerUrl + "check_password",
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
            res.status(500).send("Chat server is offline");
            return;
        }
        if (body == "0") {
            req.session.username = username;
            req.session.password = password;
            res.status(200).send("Ok");
        }
        else {
            res.status(403).send("Invalid username or password");
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
});
exports.app.post("/logout", (req, res) => {
    if (!req.session.username || !req.session.username) {
        res.status(403).send("Not Logged in");
        return;
    }
    delete req.session.username;
    delete req.session.password;
    res.status(200).send("Ok");
});
/* ************************************
 *
 * START LISTENING
 *
 * ************************************/
exports.app.listen(config_1.default.port, () => console.log('Listening on port ' + config_1.default.port + '!'));
