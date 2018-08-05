$(() => {
    const password = "12345";
    const messageCount = 10;
    const accounts = [
        {
            id: "admin",
            name: "PinoyPlus"
        },
        {
            id: "caloocan",
            name: "Caloocan City Clinic"
        },
        {
            id: "manila_doctors",
            name: "Manila Doctors Hospital"
        },
        {
            id: "ph_gen_hospital",
            name: "Philippine General Hospital"
        }
    ];
    const adminServerUrl = $("#adminServerUrl").val() + "";
    const chatServerUrl = $("#chatServerUrl").val() + "";
    const chatHost = $("#chatHost").val() + "";
    $("#adminAccount").remove();
    $("#adminServerUrl").remove();
    $("#chatServerUrl").remove();
    $("#chatHost").remove();
    const a = new Admin(adminServerUrl);
    let p = Promise.resolve();
    // Register accounts
    for (let account of accounts) {
        p = p.then(() => {
            console.log(`Attempting to register Account ${account.id}@${chatHost}`);
            return a.cmd("register", {
                user: account.id,
                host: chatHost,
                password: password
            });
        }).then(e => {
            console.log(`Account ${account.id} was ${e.error ? "not" : "succesfully"} registered ${e.error ? ": " + e.content : ""}`);
        }).then(e => {
            console.log(`Setting Name '${account.name}' for Account ${account.id}@${chatHost}`);
            return a.cmd("set_vcard", {
                user: account.id,
                host: chatHost,
                name: "NICKNAME",
                content: account.name
            });
        });
    }
    for (let acc1 of accounts) {
        for (let acc2 of accounts) {
            if (acc1 == acc2)
                continue;
            p = p.then(e => {
                console.log(`Clear Subscription between'${acc1.name} and ${acc2.name}`);
                return a.cmd("delete_rosteritem", {
                    localuser: acc1.id,
                    localserver: chatHost,
                    user: acc2.id,
                    server: chatHost
                });
            }).then(e => {
                console.log(`Add Subscription between ${acc1.name} and ${acc2.name}`);
                return a.cmd("add_rosteritem", {
                    localuser: acc1.id,
                    localserver: chatHost,
                    user: acc2.id,
                    server: chatHost,
                    nick: acc2.name,
                    group: "Business Partners",
                    subs: "both"
                });
            });
        }
    }
    for (let acc1 of accounts) {
        for (let acc2 of accounts) {
            if (acc1 == acc2)
                continue;
            p = p.then(e => {
                console.log(`Send ${messageCount} Message from ${acc1.name} to ${acc2.name}`);
            });
            for (let i = 0; i < messageCount; i++) {
                p = p.then(e => {
                    let msg = `I am ${acc1.name} and this is my ${i}th message to ${acc2.name}`;
                    return a.cmd("send_message", {
                        type: "chat",
                        from: acc1.id + "@" + chatHost,
                        to: acc2.id + "@" + chatHost,
                        subject: "Hello",
                        body: msg,
                    });
                });
            }
        }
    }
    p = p.then(() => console.log("Done!"));
});
