import config from "../config"
import app from "../index"

import session = require('express-session')

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