
type ClientOptions = {
    host: string,
    jid: string,
    password: string,
    debug?: boolean
}
class Client {

    public host: string
    public jid: string
    public password: string
    public connection: Strophe.Connection
    public jids: { [key: string]: string }
    public eventHandlers: { [key: string]: (args?: any) => any }

    constructor(args: ClientOptions) {
        this.host = args.host || '/http-bind';
        this.jid = args.jid;
        this.password = args.password;
        this.connection = new Strophe.Connection(this.host);
        this.jids = {}

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

    public on(eventName: string, callback: (args?: any) => any) {
        this.eventHandlers[eventName] = callback
    }
    public off(eventName: string) {
        delete this.eventHandlers[eventName]
    }

    private _publish(eventName: string, args?: any) {
        let handler = this.eventHandlers[eventName]
        if (handler && handler instanceof Function)
            handler(args)
    }
    private _onConnect(status: Strophe.Status) {
        var Status = Strophe.Status;

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

    private _onConnected() {
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

    private _onPresenceChange(stanza) {
        stanza = $(stanza);

        // @show: possible values: XMPP native 'away', 'chat', 'dnd', 'xa' and 2 custom 'online' and 'offline'
        // @status: human-readable string e.g. 'on vacation'

        var fullJid = stanza.attr('from'),
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

    private _onMessage(stanza) {
        stanza = $(stanza);

        var fullJid = stanza.attr('from'),
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

    private _onRoster(stanza) {
        var message = this._handleRosterStanza(stanza);

        // Wrap message array again into an array,
        // otherwise jQuery will split it into separate arguments
        // when passed to 'bind' function
        this._publish('roster.client.im', [message]);
        return true;
    };

    private _onRosterChange(stanza) {
        var message = this._handleRosterStanza(stanza);

        this._publish('rosterChange.client.im', [message]);
        return true;
    };

    private _handleRosterStanza(stanza) {
        var self = this,
            items = $(stanza).find('item');

        return items.map(function (index, item) {
            item = $(item);

            var fullJid = item.attr('jid'),
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
    public connect() {
        this.connection.connect(this.jid, this.password, this._onConnect);
        return this;
    };

    public disconnect(reason?: string) {
        this.connection.flush();
        this.connection.disconnect(reason || "");
        this._publish('disconnected.client.im');
    };

    public send(stanza) {
        this.connection.send(stanza);
    };

    public iq(stanza, error, success) {
        this.connection.sendIQ(stanza, success, error);
    };

    public presence(status?) {
        var stanza = $pres();
        if (status) {
            stanza.attrs({ type: status });
        }
        this.send(stanza);
    };

    public message(to, message) {
        var fullJid = this.jids[to],
            stanza = $msg({
                to: fullJid,
                type: 'chat'
            }).c('body').t(message);
        this.send(stanza);
    };

    public getRoster(error, success) {
        var stanza = $iq({ type: 'get' }).c('query', { xmlns: Strophe.NS.ROSTER });
        this.iq(stanza, error, success);
    };
}