import express = require('express')
import config from "./config"

export const app = express()
export default app

import "./server/module-debug"
import "./server/module-config"

// import "./server/dev/module-init_pages"
// import "./server/dev/module-refresh"

// import "./server/pages/module-default_page"
// import "./server/pages/module-pages"
// import "./server/pages/module-error_404"

import "./server/services/module-login_logout"
import "./server/services/module-is_admin"

app.get("/demo", (req, res) => {
    res.render("dashboard", {
        adminAccount: config.adminAccount,
        adminServerUrl: config.adminServerUrl,
        chatServerUrl: config.chatServerUrl,
        chatHost: config.chatHost,
        username: "admin@pinoyplus",
        password: "password",
        pageName: "dashboard"
    })
})
app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
