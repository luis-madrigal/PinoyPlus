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

    public cmd(name: "status", args: {}): Promise<AdminResult<string>>;
    public cmd(name: "reload_config", args: {}): Promise<AdminResult<"">>;

    public cmd(name: "get_vcard", args: {
        user: string,
        host: string,
        name: VCardType
    }): Promise<AdminResult<{ content: string }>>;
    public cmd(name: "set_vcard", args: {
        user: string,
        host: string,
        name: VCardType,
        content: string
    }): Promise<AdminResult<"">>;

    public cmd(name: "get_roster", args: {
        user: string,
        server: string
    }): Promise<AdminResult<RosterInfo[]>>;
    public cmd(name: "add_rosteritem", args: {
        localuser: string,
        localserver: string,
        user: string,
        server: string,
        nick: string,
        group: string,
        subs: string
    }): Promise<AdminResult<"">>;
    public cmd(name: "delete_rosteritem", args: {
        localuser: string,
        localserver: string,
        user: string,
        server: string
    }): Promise<AdminResult<"">>;


    public cmd(name: "send_message", args: {
        type: string,
        from: string,
        to: string,
        subject: string,
        body: string,
    }): Promise<AdminResult<"">>;

    public cmd(name: "register", args: {
        user: string,
        host: string,
        password: string
    }): Promise<AdminResult<"Success" | ServerMessage>>;

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