import config from "../config"
import * as utils from "./server-utils"

import * as express from "express"
import request = require('request')

export function requireLogin(handler: express.RequestHandler, errHandler?: express.ErrorRequestHandler): express.RequestHandler {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err
        } else
            throw new Error(err)
    })

    return (req, res, next) => {
        let auth = req.session;

        if (auth && auth.username && auth.password) {
            handler(req, res, next)
            return
        }

        errHandler(new Error("Forbidden: The user is not logged in"), req, res, next)
    }
}
export function requireValidatedLogin(handler: express.RequestHandler, errHandler?: express.ErrorRequestHandler): express.RequestHandler {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err
        } else
            throw new Error(err)
    })

    return (req, res, next) => {
        let auth = req.session;

        if (auth && auth.username && auth.password) {
            request({
                method: "POST",
                url: config.adminServerUrl + "check_password",
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
                    errHandler(new Error("Forbidden: Chat server error"), req, res, next)
                    return
                }

                if (body == "1") {
                    errHandler(new Error("Forbidden: The user is not logged in"), req, res, next)
                    return
                }

                handler(req, res, next)
            })
        }
        errHandler(new Error("Forbidden: The user is not logged in"), req, res, next)
    }
}

export function requireAdmin(handler: express.RequestHandler, errHandler?: express.ErrorRequestHandler): express.RequestHandler {
    errHandler = errHandler || (err => {
        if (err instanceof Error) {
            throw err
        } else
            throw new Error(err)
    })

    return (req, res, next) => {
        let auth = req.session;

        if (auth && auth.username && (auth.username == config.adminAccount)) {
            handler(req, res, next)
            return
        }

        errHandler(new Error("Forbidden: The user is not an admin"), req, res, next)
    }
}