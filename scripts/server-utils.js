"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function getUserFromJid(jid) {
    return jid.substring(0, jid.lastIndexOf("@"));
}
exports.getUserFromJid = getUserFromJid;
function getHostFromJid(jid) {
    return jid.substring(jid.lastIndexOf("@") + 1);
}
exports.getHostFromJid = getHostFromJid;
