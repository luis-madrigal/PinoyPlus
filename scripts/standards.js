"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extracts user from the given jabber id
 * @param jid jabber id
 * @returns user
 */
function getUserFromJid(jid) {
    return jid.substring(0, jid.lastIndexOf("@"));
}
exports.getUserFromJid = getUserFromJid;
/**
 * Extracts host from the given jabber id
 * @param jid jabber id
 * @returns host/server
 */
function getHostFromJid(jid) {
    return jid.substring(jid.lastIndexOf("@") + 1);
}
exports.getHostFromJid = getHostFromJid;
/**
 * Get the current authorization credentials
 * @param req The express Request object
 */
function getAuth(req) {
    if (!req.session) {
        throw new Error("Sessions are not supported");
    }
    return {
        username: req.session.username + "",
        password: req.session.password + ""
    };
}
exports.getAuth = getAuth;
/**
 * Set the current authorization credentials
 * @param req The express Request object
 * @param username The jabber id (jid)
 * @param password The password
 */
function setAuth(req, username, password) {
    if (!req.session) {
        throw new Error("Sessions are not supported");
    }
    req.session.username = username;
    req.session.password = password;
}
exports.setAuth = setAuth;
