import config from "../config"
import app from "../index"

import path = require("path")

app.set('views', path.join(config.rootDir, "views"))
