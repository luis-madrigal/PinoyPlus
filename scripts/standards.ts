import * as express from "express"
import { hostname } from "os";

/**
 * Extracts user from the given jabber id
 * @param jid jabber id
 * @returns user
 */
export function getUserFromJid(jid: string): string {
    return jid.substring(0, jid.lastIndexOf("@"))
}

/**
 * Extracts host from the given jabber id
 * @param jid jabber id
 * @returns host/server
 */
export function getHostFromJid(jid: string): string {
    return jid.substring(jid.lastIndexOf("@") + 1)
}

/**
 * Authentication information
 */
export interface AuthInfo {
    /**
     * The jabber Id (jid)
     */
    username: string
    /**
     * The password
     */
    password: string
}
/**
 * Get the current authorization credentials
 * @param req The express Request object
 */
export function getAuth(req: express.Request): AuthInfo {
    if (!req.session) {
        throw new Error("Sessions are not supported")
    }
    return {
        username: req.session.username + "",
        password: req.session.password + ""
    }
}
/**
 * Set the current authorization credentials
 * @param req The express Request object
 * @param username The jabber id (jid)
 * @param password The password
 */
export function setAuth(req: express.Request, username: string, password: string): void {
    if (!req.session) {
        throw new Error("Sessions are not supported")
    }
    req.session.username = username
    req.session.password = password
}