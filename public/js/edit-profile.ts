$(() => {
    let url = window.location.origin + "/is_admin"
    $.ajax({
        url: url,
        type: 'post'
    }).done(isAdmin => {
        if (!isAdmin) {
            console.log("I am not an admin")
            $("#edit").remove()
            $(".edit").remove()
        } else {
            console.log("I am an admin")
        }
    }).fail(e => {
        $("#edit").remove()
        $(".edit").remove()
    })

    $("#edit").click(() => {
        // On click copy data from the view panel to the edit panel
        $("#titleEdit").val($("#titleView").text())
        $("#numberEdit").val($("#numberView").text())
        $("#emailEdit").val($("#emailView").text())
        $("#addressEdit").val($("#addressView").text())

        // TODO transfer list of admins
        $(".remove-me").click() // Clear all admin input fields
        $("#admin-list").find("span").each(function () {
            let span = $(this)
            addAdmin(span.text())
        })
    })

    function loadPRCInfo() {
        console.log("Clicking PRC Info")
        const admin = new Admin(DASHBOARD_CHAT.adminServerUrl)

        admin.getDesc(DASHBOARD_CHAT.adminAccount).then(e => {
            if (e.message == "error_no_value_found_in_vcard") {

                return {
                    jid: "N/A",
                    img: "img/face.png",
                    name: "N/A",
                    contact: {
                        name: "N/A",
                        email: "N/A",
                        num: "N/A",
                        addr: "N/A"
                    },
                    members: []
                }
            }
            return e.content
        }).then((data: ProfileInfo) => {
            console.log("DATA", data)

            $("#titleView").text(data.name)
            $("#numberView").text(data.contact.num)
            $("#emailView").text(data.contact.email)
            $("#addressView").text(data.contact.addr)

            $("#admin-list").empty()
            for (let name of data.members || []) {
                $("#admin-list").append(`<span>${name}</span>`)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    $("#prc-info").click(loadPRCInfo)

    $("#done").click(() => {
        const admin = new Admin(DASHBOARD_CHAT.adminServerUrl)

        const title: string = $("#titleEdit").val() + ""

        const admins: string[] = []
        $("#admin-field").find("input").each(function () {
            let f = $(this)
            console.log(f)
            admins.push(f.val() + "")
        })
        admins.pop()

        const num = $("#numberEdit").val() + ""
        const email = $("#emailEdit").val() + ""
        const addr = $("#addressEdit").val() + ""

        let info: ProfileInfo = {
            jid: DASHBOARD_CHAT.username,
            name: title,
            img: "img/face.png",
            members: admins,
            contact: {
                name: "PinoyPlus",
                num: num,
                email: email,
                addr: addr
            }
        }
        admin.setDesc(DASHBOARD_CHAT.username, info)
            .then(() => console.log("Profile Set", info))
            .then(() => loadPRCInfo())
    })
})