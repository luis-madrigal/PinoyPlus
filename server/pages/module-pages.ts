import config from "../../config"
import app from "../../index"

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