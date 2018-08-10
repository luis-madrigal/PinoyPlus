import config from "../config"
import app from "../index"

import express = require('express')
import path = require("path")

app.use('/', express.static(path.join(config.rootDir, "public")))