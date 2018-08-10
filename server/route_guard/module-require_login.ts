import config from "../../config"
import app from "../../index"

app.get("*", (req, res, next) => {
    let auth = req.session;

    if (!(auth && auth.username && auth.password)) {
        res.redirect("/")
        return;
    }
    next()
})