"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const index_1 = require("../../index");
index_1.default.post("/is_admin", (req, res) => {
    if (req.session && req.session.username && (req.session.username == config_1.default.adminAccount)) {
        res.status(200).json(true);
    }
    else {
        res.status(200).json(false);
    }
});
