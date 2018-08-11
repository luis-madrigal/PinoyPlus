import config from "../../config"
import app from "../../index"

app.post("/is_admin", (req, res) => {
    if (req.session && req.session.username && (req.session.username == config.adminAccount)) {
        res.status(200).json(true)
    } else {
        res.status(403).json(false)
    }
})