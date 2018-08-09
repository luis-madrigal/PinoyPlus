/*
For APIs visit:
https://docs.ejabberd.im/developer/ejabberd-api/admin-api/
 
EXAMPLE
Documents (see URL) says:
POST /api/get_vcard
    {
      "user": "user1",
      "host": "myserver.com",
      "name": "NICKNAME"
    }
 
Do this:
const admin = new Admin("http://104.215.190.53:9000/")
admin.cmd("get_vcard",{
    "user": "user1",
    "host": "myserver.com",
    "name": "NICKNAME"
}).then(res => console.log(res))
 
*/
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
    setVCard(jid, info, value) {
        return this.cmd("set_vcard", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            content: value
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
