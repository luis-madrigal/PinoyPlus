"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const index_1 = require("../index");
const utils = require("../scripts/server-utils");
const express = require("express");
const session = require("express-session");
const path = require("path");
// Encoding Handlers
index_1.default.use(express.json());
index_1.default.use(express.urlencoded());
// Session
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
// Public files
index_1.default.use("/", utils.filteredStatic(path.join(config_1.default.rootDir, "public"), req => !req.path.endsWith(".ts"))); // No .ts files
// View Rendering
index_1.default.set('view engine', 'ejs');
index_1.default.set('views', path.join(config_1.default.rootDir, "views"));
