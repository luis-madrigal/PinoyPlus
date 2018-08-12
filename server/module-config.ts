import config from "../config"
import app from "../index"

import * as utils from "../scripts/server-utils"

import express = require('express')
import session = require('express-session')
import path = require("path")

// Encoding Handlers
app.use(express.json());
app.use(express.urlencoded())

// Session
app.set('trust proxy', 1)
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    }
}))

// Public files
app.use("/", utils.filteredStatic(path.join(config.rootDir, "public"), req => !req.path.endsWith(".ts"))) // No .ts files

// View Rendering
app.set('view engine', 'ejs')
app.set('views', path.join(config.rootDir, "views"))