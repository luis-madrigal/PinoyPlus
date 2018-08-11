"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
index_1.default.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
});
