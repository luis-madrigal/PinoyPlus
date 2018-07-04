const xmpp = require("@xmpp/client")
const Client = xmpp.Client
const xml = xmpp.xml

const client = new Client()

// Log errors
client.on('error', err => {
    console.error('❌', err.message)
})

// Log status changes
client.on('status', status => {
    console.log('ℹ️', status)
})

// Useful for logging raw traffic
// Emitted for every incoming fragment
client.on('input', data => console.log('👈', data))
// Emitted for every outgoing fragment
client.on('output', data => console.log('👉', data))

// Useful for logging XML traffic
// Emitted for every incoming XML element
// client.on('element', data => console.log('⮈', data))
// Emitted for every outgoing XML element
// client.on('send', data => console.log('⮊', data))

client.on('stanza', el => {
    if (el.is('presence') && el.attrs.from === client.jid.toString()) {
        console.log('👌', 'available, ready to receive <message/>s')
    }
})

client.on('online', jid => {
    console.log('jid', jid.toString())
    client.send(xml('presence'))

    // prettier-ignore
    client.send(
        xml('message', {
                to: 'sonny@xmppjs.org',
                type: 'chat'
            },
            xml('body', {}, 'hello')
        )
    )
})

// "start" opens the socket and the XML stream
client
    // .start('xmppjs.org') // Auto
    .start('xmpp://localhost:5222') // TCP
    // .start('xmpps://xmppjs.org:5223') // TLS
    // .start('ws://xmppjs.org:5280/xmpp-websocket') // Websocket
    // .start('127.0.0.1:5280') // Websocket
    // .start('wss://xmppjs.org:5281/xmpp-websocket') // Secure WebSocket
    .catch(err => {
        console.error('start failed', err.message)
    })

// Handle authentication to provide credentials
client.handle('authenticate', authenticate => {
    return authenticate('admin', '12345')
})

// Handle binding to choose resource - optional
client.handle('bind', bind => {
    return bind('example')
})