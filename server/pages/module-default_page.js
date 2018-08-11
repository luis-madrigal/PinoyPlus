"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const index_1 = require("../../index");
index_1.default.get('/', (req, res) => {
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
