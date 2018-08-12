import * as express from "express"
import * as serverStatic from "serve-static";


export interface RequestFilter {
    (req: express.Request, res: express.Response, next: express.NextFunction): boolean
}
/**
 * An extended handler for express.static with additional filter feature
 * @param root the path that the handler will listen to
 * @param filter a callback that must return true to pass the request to express.static, must return false to pass request to the next handler (i.e. next())
 * @param options express.static options
 * @returns an extended express.static handler
 */
export function filteredStatic(root: string, filter: RequestFilter, options?: serverStatic.ServeStaticOptions): express.Handler {
    const handler = express.static(root, options)
    return (req, res, next) => {
        if (filter(req, res, next)) {
            handler(req, res, next)
        } else {
            next()
        }
    }
}

/**
 * Similar JSON.stringify but allowed on objects with cirucalar references
 * @param obj object
 * @param spacing prettify spacing
 * @returns JSON string representation
 */
export function jsonCircle(obj: object, spacing?: number) {
    var cache = [];
    var str = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
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
