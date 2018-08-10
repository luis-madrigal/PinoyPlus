import config from "../../config"
import app from "../../index"

app.get('/init', (req, res) => {
    res.render("init", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost
    })
})