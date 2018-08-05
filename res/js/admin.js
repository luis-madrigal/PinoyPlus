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
