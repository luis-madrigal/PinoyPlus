"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config_1 = require("./config");
exports.app = express();
exports.default = exports.app;
require("./server/module-debug");
require("./server/module-config");
// import "./server/dev/module-init_pages"
// import "./server/dev/module-refresh"
// import "./server/pages/module-default_page"
// import "./server/pages/module-pages"
// import "./server/pages/module-error_404"
require("./server/services/module-login_logout");
require("./server/services/module-is_admin");
exports.app.get("/demo", (req, res) => {
    res.render("dashboard", {
        adminAccount: config_1.default.adminAccount,
        adminServerUrl: config_1.default.adminServerUrl,
        chatServerUrl: config_1.default.chatServerUrl,
        chatHost: config_1.default.chatHost,
        username: "admin@pinoyplus",
        password: "password",
        pageName: "dashboard"
    });
});
exports.app.listen(config_1.default.port, () => console.log('Listening on port ' + config_1.default.port + '!'));
