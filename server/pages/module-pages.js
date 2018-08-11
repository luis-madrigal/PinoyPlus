"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const index_1 = require("../../index");
const handler_builders_1 = require("../../scripts/handler-builders");
function requireLoginElseRedirect(handler) {
    return handler_builders_1.requireLogin(handler, (err, req, res) => res.redirect("/"));
}
index_1.default.get('/announcements', requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("announcements-main", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
index_1.default.get('/threads', requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("announcements-thread", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
index_1.default.get('/posts', requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("announcements-post", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
index_1.default.get('/feedback', requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("feedback", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
index_1.default.get("/about", requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("about", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
index_1.default.get("/database", requireLoginElseRedirect((req, res) => {
    let auth = req.session;
    res.render("database", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: auth.username,
        password: auth.password
    });
}));
