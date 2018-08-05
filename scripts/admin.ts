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
    content: string
}
interface RosterInfo {
    jid: string,
    nick: string,
    subscription: string,
    ask: string,
    group: string
}

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

    public cmd(name: "status", args: { user: string, server: string }): Promise<AdminResult<string>>;
    public cmd(name: "get_roster", args: {}): Promise<AdminResult<RosterInfo[]>>;
    public cmd(name: "register", args: { user: string, host: string, password: string }): Promise<AdminResult<"Success" | ServerMessage>>;
    public cmd(name: string, args: any): Promise<AdminResult<any>> {
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
                    content: data
                })
            }).fail((jqXHR, textStatus, errorThrown) => {
                resolve({
                    error: true,
                    message: textStatus,
                    status: jqXHR.status,
                    headers: jqXHR.getAllResponseHeaders(),
                    content: jqXHR.responseJSON || jqXHR.responseXML || jqXHR.responseText
                })
            })
        })
    }
}