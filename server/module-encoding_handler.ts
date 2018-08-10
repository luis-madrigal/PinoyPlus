import config from "../config"
import app from "../index"

import express = require('express')

app.use(express.json());
app.use(express.urlencoded())