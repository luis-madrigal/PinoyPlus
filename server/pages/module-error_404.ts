import config from "../../config"
import app from "../../index"

app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
})