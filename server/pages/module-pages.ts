import config from "../../config"
import app from "../../index"
import { requireLogin } from "../../scripts/handler-builders";

import * as express from "express"

function requireLoginElseRedirect(handler: express.RequestHandler) {
    return requireLogin(handler, (err, req, res) => res.redirect("/"))
}

app.get('/announcements', requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("announcements-main", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))

app.get('/threads', requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("announcements-thread", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))

app.get('/posts', requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("announcements-post", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))

app.get('/feedback', requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("feedback", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))

app.get("/about", requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("about", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))

app.get("/database", requireLoginElseRedirect((req, res) => {
    let auth = req.session;

    res.render("database", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: auth.username,
        password: auth.password
    })
}))