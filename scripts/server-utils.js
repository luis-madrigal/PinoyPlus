"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Similar JSON.stringify but allowed on objects with cirucalar references
 * @param obj object
 * @param spacing prettify spacing
 * @returns JSON string representation
 */
function jsonCircle(obj, spacing) {
    var cache = [];
    var str = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                }
                catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, spacing);
    cache = null;
    return str;
}
exports.jsonCircle = jsonCircle;
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
