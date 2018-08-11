"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils = require("./server-utils");
const request = require("request");
function requireLogin(handler, errHandler) {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err;
        }
        else
            throw new Error(err);
    });
    return (req, res, next) => {
        let auth = req.session;
        if (auth && auth.username && auth.password) {
            handler(req, res, next);
            return;
        }
        errHandler(new Error("Forbidden: The user is not logged in"), req, res, next);
    };
}
exports.requireLogin = requireLogin;
function requireValidatedLogin(handler, errHandler) {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err;
        }
        else
            throw new Error(err);
    });
    return (req, res, next) => {
        let auth = req.session;
        if (auth && auth.username && auth.password) {
            request({
                method: "POST",
                url: config_1.default.adminServerUrl + "check_password",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: utils.getUserFromJid(auth.username),
                    host: utils.getHostFromJid(auth.username),
                    password: auth.password
                })
            }, (error, response, body) => {
                if (error) {
                    errHandler(new Error("Forbidden: Chat server error"), req, res, next);
                    return;
                }
                if (body == "1") {
                    errHandler(new Error("Forbidden: The user is not logged in"), req, res, next);
                    return;
                }
                handler(req, res, next);
            });
        }
        errHandler(new Error("Forbidden: The user is not logged in"), req, res, next);
    };
}
exports.requireValidatedLogin = requireValidatedLogin;
function requireAdmin(handler, errHandler) {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err;
        }
        else
            throw new Error(err);
    });
    return (req, res, next) => {
        let auth = req.session;
        if (auth && auth.username && (auth.username == config_1.default.adminAccount)) {
            handler(req, res, next);
            return;
        }
        errHandler(new Error("Forbidden: The user is not an admin"), req, res, next);
    };
}
exports.requireAdmin = requireAdmin;
