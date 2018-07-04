class Client {

    host = ""
    jid = ""
    password = ""
    connection = new Strophe.Connection(this.host)
    jids = {}
    eventHandlers = {}

    constructor(args) {
        this.host = args.host || '/http-bind';
        this.jid = args.jid || "";
        this.password = args.password || "";
        this.connection = new Strophe.Connection(this.host);

        if (args.debug) {
            this.connection.xmlInput = xml => {
                console.log('Incoming:');
                console.log(xml);
            };
            this.connection.xmlOutput = xml => {
                console.log('Outgoing:');
                console.log(xml);
            };
        }
    }

    on(eventName, callback) {
        this.eventHandlers[eventName] = callback
    }
    off(eventName) {
        delete this.eventHandlers[eventName]
    }

    _publish(eventName, args) {
        let handler = this.eventHandlers[eventName]
        if (handler && handler instanceof Function)
            handler(args)
    }
    _onConnect(status) {
        let Status = Strophe.Status;

        switch (status) {
            case Status.ERROR:
                this._publish('error.client.im');
                break;
            case Status.CONNECTING:
                this._publish('connecting.client.im');
                break;
            case Status.CONNFAIL:
                this._publish('connfail.client.im');
                break;
            case Status.AUTHENTICATING:
                this._publish('authenticating.client.im');
                break;
            case Status.AUTHFAIL:
                this._publish('authfail.client.im');
                break;
            case Status.CONNECTED:
                this._onConnected();
                this._publish('connected.client.im');
                break;
            case Status.DISCONNECTING:
                this._publish('diconnecting.client.im');
                break;
            case Status.DISCONNECTED:
                this._publish('diconnected.client.im');
                break;
            case Status.ATTACHED:
                this._publish('attached.client.im');
                break;
        }

        return true;
    };

    _onConnected() {
        // get friend list
        this.getRoster(null, this._onRoster);

        // monitor friend list changes
        this.connection.addHandler(this._onRosterChange, Strophe.NS.ROSTER, 'iq', 'set');

        // monitor friends presence changes
        this.connection.addHandler(this._onPresenceChange, null, 'presence');

        // monitor incoming chat messages
        this.connection.addHandler(this._onMessage, null, 'message', 'chat');

        // notify others that we're online and request their presence status
        this.presence();
    };

    _onPresenceChange(stanza) {
        stanza = $(stanza);

        // @show: possible values: XMPP native 'away', 'chat', 'dnd', 'xa' and 2 custom 'online' and 'offline'
        // @status: human-readable string e.g. 'on vacation'

        let fullJid = stanza.attr('from'),
            bareJid = Strophe.getBareJidFromJid(fullJid),
            show = stanza.attr('type') === 'unavailable' ? 'offline' : 'online',
            message = {
                from: fullJid,
                type: stanza.attr('type') || 'available',
                show: stanza.find('show').text() || show,
                status: stanza.find('status').text()
            };

        // Reset addressing
        // if online
        this.jids[bareJid] = fullJid;
        // else
        // this.jids[bareJid] = bareJid;

        this._publish('presence.client.im', message);
        return true;
    };

    _onMessage(stanza) {
        stanza = $(stanza);

        let fullJid = stanza.attr('from'),
            bareJid = Strophe.getBareJidFromJid(fullJid),
            body = stanza.find('body').text(),
            // TODO: fetch activity
            activity = 'active',
            message = {
                id: stanza.attr('id'),
                from: fullJid,
                body: body,
                activity: activity
            };

        // Reset addressing
        this.jids[bareJid] = fullJid;

        this._publish('message.client.im', message);
        return true;
    };

    _onRoster(stanza) {
        let message = this._handleRosterStanza(stanza);

        // Wrap message array again into an array,
        // otherwise jQuery will split it into separate arguments
        // when passed to 'bind' function
        this._publish('roster.client.im', [message]);
        return true;
    };

    _onRosterChange(stanza) {
        let message = this._handleRosterStanza(stanza);

        this._publish('rosterChange.client.im', [message]);
        return true;
    };

    _handleRosterStanza(stanza) {
        let self = this,
            items = $(stanza).find('item');

        return items.map(function (index, item) {
            item = $(item);

            let fullJid = item.attr('jid'),
                bareJid = Strophe.getBareJidFromJid(fullJid);

            // Setup addressing
            self.jids[bareJid] = fullJid;

            return {
                jid: fullJid,
                subscription: item.attr('subscription')
            };
        }).get();
    };


    // public properties and methods
    connect() {
        this.connection.connect(this.jid, this.password, this._onConnect);
        return this;
    };

    disconnect(reason) {
        this.connection.flush();
        this.connection.disconnect(reason || "");
        this._publish('disconnected.client.im');
    };

    send(stanza) {
        this.connection.send(stanza);
    };

    iq(stanza, error, success) {
        this.connection.sendIQ(stanza, success, error);
    };

    presence(status) {
        let stanza = $pres();
        if (status) {
            stanza.attrs({
                type: status
            });
        }
        this.send(stanza);
    };

    message(to, message) {
        let fullJid = this.jids[to];
        let stanza = $msg({
            to: fullJid,
            type: 'chat'
        }).c('body').t(message);
        this.send(stanza);
    };

    getRoster(error, success) {
        let stanza = $iq({
            type: 'get'
        }).c('query', {
            xmlns: Strophe.NS.ROSTER
        });
        this.iq(stanza, error, success);
    };
}