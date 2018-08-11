class Admin {
    constructor(_apiUrl) {
        this._apiUrl = _apiUrl;
    }
    static getUser(jid) {
        return jid.substring(0, jid.lastIndexOf("@"));
    }
    static getHost(jid) {
        return jid.substring(jid.lastIndexOf("@") + 1);
    }
    status() {
        return this.cmd("status", {});
    }
    reloadConfig() {
        return this.cmd("reload_config", {});
    }
    getDesc(jid) {
        return this.getVcard(jid, "DESC").then(r => {
            let obj = r.content;
            if (!r.error) {
                try {
                    obj = JSON.parse(r.content);
                }
                catch (e) {
                    obj = r.content;
                }
            }
            return {
                error: r.error,
                message: r.message,
                status: r.status,
                headers: r.headers,
                content: obj
            };
        });
    }
    setDesc(jid, info) {
        return this.setVcard(jid, "DESC", JSON.stringify(info));
    }
    getVcard(jid, info) {
        return this.cmd("get_vcard", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info
        }).then(r => ({
            error: r.error,
            message: r.message,
            status: r.status,
            headers: r.headers,
            content: r.error ? "" : r.content.content
        }));
    }
    getVcard2(jid, info, subinfo) {
        return this.cmd("get_vcard2", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo
        }).then(r => ({
            error: r.error,
            message: r.message,
            status: r.status,
            headers: r.headers,
            content: r.error ? "" : r.content.content
        }));
    }
    getVcard2Multi(jid, info, subinfo) {
        return this.cmd("get_vcard2_multi", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo
        }).then(r => ({
            error: r.error,
            message: r.message,
            status: r.status,
            headers: r.headers,
            content: r.error ? [] : r.content
        }));
    }
    setVcard(jid, info, value) {
        return this.cmd("set_vcard", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            content: value
        });
    }
    setVcard2(jid, info, subinfo, value) {
        return this.cmd("set_vcard2", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo,
            content: value
        });
    }
    setVcard2Multi(jid, info, subinfo, values) {
        return this.cmd("set_vcard2_multi", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo,
            contents: values
        });
    }
    getRoster(jid) {
        return this.cmd("get_roster", {
            user: Admin.getUser(jid),
            server: Admin.getHost(jid)
        });
    }
    addRosterItem(jid, otherJid, otherNickname) {
        return this.cmd("add_rosteritem", {
            localuser: Admin.getUser(jid),
            localserver: Admin.getHost(jid),
            user: Admin.getUser(otherJid),
            server: Admin.getHost(otherJid),
            nick: otherNickname,
            group: "Friends",
            subs: "both"
        });
    }
    deleteRosterItem(jid, otherJid) {
        return this.cmd("delete_rosteritem", {
            localuser: Admin.getUser(jid),
            localserver: Admin.getHost(jid),
            user: Admin.getUser(otherJid),
            server: Admin.getHost(otherJid)
        });
    }
    sendMessage(fromJid, toJid, text) {
        return this.cmd("send_message", {
            type: "chat",
            from: fromJid,
            to: toJid,
            subject: "Chat",
            body: text,
        });
    }
    register(jid, password) {
        return this.cmd("register", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            password: password
        });
    }
    cmd(name, args) {
        console.log("ADMIN", this._apiUrl + name, args);
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: this._apiUrl + name,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(args)
            }).done((data, textStatus, jqXHR) => {
                resolve({
                    error: false,
                    message: textStatus,
                    status: 200,
                    headers: jqXHR.getAllResponseHeaders(),
                    content: data || jqXHR.responseJSON || jqXHR.responseXML || jqXHR.responseText
                });
            }).fail((jqXHR, textStatus, errorThrown) => {
                console.error(errorThrown);
                resolve({
                    error: true,
                    message: textStatus,
                    status: jqXHR.status,
                    headers: jqXHR.getAllResponseHeaders(),
                    content: jqXHR.responseJSON || jqXHR.responseXML || jqXHR.responseText || errorThrown
                });
            });
        });
    }
}
