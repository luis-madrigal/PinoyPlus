interface ServerMessage {
    status: string,
    code: number,
    message: string
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

interface Result<T> {
    error: boolean,
    message: string,
    status: number,
    headers: string,
    content: T
}
type ResultPromise<T> = Promise<Result<T>>

class Admin {

    constructor(private _apiUrl: string) { }

    public static getUser(jid: string): string {
        return jid.substring(0, jid.lastIndexOf("@"))
    }
    public static getHost(jid: string): string {
        return jid.substring(jid.lastIndexOf("@") + 1)
    }

    public status(): ResultPromise<string> {
        return this.cmd("status", {})
    }
    public reloadConfig(): ResultPromise<""> {
        return this.cmd("reload_config", {})
    }

    public getDesc(jid: string): ResultPromise<any> {
        return this.getVcard(jid, "DESC").then(r => {

            let obj = r.content
            if (!r.error) {
                try {
                    obj = JSON.parse(r.content)
                } catch (e) {
                    obj = r.content
                }
            }

            return {
                error: r.error,
                message: r.message,
                status: r.status,
                headers: r.headers,
                content: obj
            }
        })
    }
    public setDesc(jid: string, info: any): ResultPromise<""> {
        return this.setVcard(jid, "DESC", JSON.stringify(info))
    }

    public getVcard(jid: string, info: VCardType): ResultPromise<string> {
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
    public getVcard2(jid: string, info: VCardType, subinfo: string): ResultPromise<string> {
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
        }))
    }
    public getVcard2Multi(jid: string, info: VCardType, subinfo: string): ResultPromise<string[]> {
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
        }))
    }

    public setVcard(jid: string, info: VCardType, value: string): ResultPromise<""> {
        return this.cmd("set_vcard", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            content: value
        })
    }
    public setVcard2(jid: string, info: VCardType, subinfo: string, value: string): ResultPromise<""> {
        return this.cmd("set_vcard2", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo,
            content: value
        })
    }
    public setVcard2Multi(jid: string, info: VCardType, subinfo: string, values: string[]): ResultPromise<""> {
        return this.cmd("set_vcard2_multi", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            name: info,
            subname: subinfo,
            contents: values
        })
    }

    public getRoster(jid: string): ResultPromise<RosterInfo[]> {
        return this.cmd("get_roster", {
            user: Admin.getUser(jid),
            server: Admin.getHost(jid)
        })
    }

    public addRosterItem(jid: string, otherJid: string, otherNickname: string): ResultPromise<""> {
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
    public deleteRosterItem(jid: string, otherJid: string): ResultPromise<""> {
        return this.cmd("delete_rosteritem", {
            localuser: Admin.getUser(jid),
            localserver: Admin.getHost(jid),
            user: Admin.getUser(otherJid),
            server: Admin.getHost(otherJid)
        })
    }

    public sendMessage(fromJid: string, toJid: string, text: string): ResultPromise<""> {
        return this.cmd("send_message", {
            type: "chat",
            from: fromJid,
            to: toJid,
            subject: "Chat",
            body: text,
        })
    }

    public register(jid: string, password: string): ResultPromise<"Success" | ServerMessage> {
        return this.cmd("register", {
            user: Admin.getUser(jid),
            host: Admin.getHost(jid),
            password: password
        })
    }

    public cmd(name: string, args: any): ResultPromise<any> {
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