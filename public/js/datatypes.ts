type ProfileInfo = {
    jid: string,
    img: string,
    name: string,
    contact: {
        name: string,
        email: string,
        num: string,
        addr: string
    },
    members?: string[]
}