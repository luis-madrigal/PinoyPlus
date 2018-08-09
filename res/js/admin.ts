interface ServerMessage {
    status: string,
    code: number,
    message: string
}
interface AdminResult<T> {
    error: boolean,
    message: string,
    status: number,
    headers: string,
    content: T
}
interface RosterInfo {
    jid: string,
    nick: string,
    subscription: string,
    ask: string,
    group: string
}

type VCardType =
    "NICKNAME" |
    "PHOTO" |
    "BDAY" |
    "ADR" |
    "LABEL" |
    "TEL" |
    "EMAIL" |
    "JABBERID" |
    "MAILER" |
    "TZ" |
    "GEO" |
    "TITLE" |
    "ROLE" |
    "LOGO" |
    "AGENT" |
    "ORG" |
    "CATEGORIES" |
    "NOTE" |
    "PRODID" |
    "REV" |
    "SORT-STRING" |
    "SOUND" |
    "UID" |
    "URL" |
    "CLASS" |
    "KEY" |
    "DESC"


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

    constructor(private _apiUrl: string) { }

    public static getUser(jid: string): string {
        return jid.substring(0, jid.lastIndexOf("@"))
    }
    public static getHost(jid: string): string {
        return jid.substring(jid.lastIndexOf("@") + 1)
    }

    public status(): Promise<AdminResult<string>> {
        return this.cmd("status", {})
    }
    public reloadConfig(): Promise<AdminResult<"">> {
        return this.cmd("reload_config", {})
    }

    public getVcard(jid: string, info: VCardType): Promise<AdminResult<string>> {
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
        }))
    }
    public setVCard(jid: string, info: VCardType, value: string): Promise<AdminResult<"">> {
        return this.cmd("set_vcard", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            content: value
        })
    }

    public getRoster(jid: string): Promise<AdminResult<RosterInfo[]>> {
        return this.cmd("get_roster", {
            user: Admin.getUser(jid),
            server: Admin.getHost(jid)
        })
    }

    public addRosterItem(jid: string, otherJid: string, otherNickname: string): Promise<AdminResult<"">> {
        return this.cmd("add_rosteritem", {
            localuser: Admin.getUser(jid),
            localserver: Admin.getHost(jid),
            user: Admin.getUser(otherJid),
            server: Admin.getHost(otherJid),
            nick: otherNickname,
            group: "Friends",
            subs: "both"
        })
    }
    public deleteRosterItem(jid: string, otherJid: string): Promise<AdminResult<"">> {
        return this.cmd("delete_rosteritem", {
            localuser: Admin.getUser(jid),
            localserver: Admin.getHost(jid),
            user: Admin.getUser(otherJid),
            server: Admin.getHost(otherJid)
        })
    }

    public sendMessage(fromJid: string, toJid: string, text: string): Promise<AdminResult<"">> {
        return this.cmd("send_message", {
            type: "chat",
            from: fromJid,
            to: toJid,
            subject: "Chat",
            body: text,
        })
    }

    public register(jid: string, password: string): Promise<AdminResult<"Success" | ServerMessage>> {
        return this.cmd("register", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            password: password
        })
    }

    public cmd(name: string, args: any): Promise<AdminResult<any>> {
        console.log("ADMIN", this._apiUrl + name, args)
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
                })
            }).fail((jqXHR, textStatus, errorThrown) => {
                console.error(errorThrown)
                resolve({
                    error: true,
                    message: textStatus,
                    status: jqXHR.status,
                    headers: jqXHR.getAllResponseHeaders(),
                    content: jqXHR.responseJSON || jqXHR.responseXML || jqXHR.responseText || errorThrown
                })
            })
        })
    }
}