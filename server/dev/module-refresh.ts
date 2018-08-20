import config from "../../config"
import app from "../../index"

import * as utils from "../../scripts/server-utils"

import cmd = require("child_process")

app.get("refresh_server", (req, res) => {

    try {
        let result = cmd.execSync("echo %cd%", {
            encoding: 'utf8'
        })
        res.write(result + "\n\n")

        result = cmd.execSync("git reset --hard", {
            encoding: 'utf8'
        })
        res.write(result + "\n\n")


        result = cmd.execSync("git pull", {
            encoding: 'utf8'
        })
        res.write(result + "\n\n")

        result = cmd.execSync("iisreset", {
            encoding: 'utf8'
        })
        res.write(result + "\n\n")
    } catch (e) {
        res.status(500)
        res.write(utils.jsonCircle(e, 4))
    } finally {
        res.end()
    }
})
