import config from "../../config"
import app from "../../index"

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
        password: auth.password,
        pageName: "dashboard"
    })
})