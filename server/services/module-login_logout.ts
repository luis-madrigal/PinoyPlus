import config from "../../config"
import app from "../../index"

import request = require('request')

import * as utils from "../../scripts/server-utils"

app.post("/login", (req, res) => {
    console.log(utils.jsonCircle(req.body, 4))

    let content = req.body

    if (!content) {
        res.status(400).send("No input provided")
        return
    }

    let username = content.username
    if (!username) {
        res.status(400).send("No username provided")
        return
    }

    let password = content.password
    if (!password) {
        res.status(400).send("No password provided")
        return
    }

    request({
        method: "POST",
        url: config.adminServerUrl + "check_password",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: utils.getUserFromJid(username),
            host: utils.getHostFromJid(username),
            password: password
        })
    }, (error, response, body) => {
        if (error) {
            res.status(500).send("Chat server is offline")
            return
        }

        if (body == "0") {
            req.session.username = username
            req.session.password = password

            res.status(200).send("Ok")
        } else {
            res.status(403).send("Invalid username or password")
        }
    })
})
app.post("/logout", (req, res) => {
    if (!req.session.username || !req.session.password) {
        res.status(403).send("Not Logged in")
        return
    }

    delete req.session.username
    delete req.session.password

    res.status(200).send("Ok")
})
