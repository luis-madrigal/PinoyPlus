"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const index_1 = require("../index");
const session = require("express-session");
index_1.default.set('trust proxy', 1);
index_1.default.use(session({
    secret: config_1.default.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    }
}));
