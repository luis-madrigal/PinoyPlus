const path = require("path")
const express = require('express')
const session = require('express-session')
const cors = require('cors')

const MemcachedStore = require("connect-memcached")(session);

const config = {

    port: process.env.port || process.env.PORT || 3000,
    chatServerUrl: "http://localhost:5280/bosh/",
    sessionSecret: "asdpfodkdpvk134po1kp24okfpokd-v0ss-wmwkemld",
    storageServerUrl: "http://localhost:5605",
    storageSecret: "ASdlmg3p442pogb-pofg,rwerwefdvdfvdfgw;el,fsv;,"
}

const app = express()

// Rendering Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')

// Encoding Handlers
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());

// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}))

// Cross-origin
app.use(cors({
    credentials: true,
    origin: true
}))

// Public Files
app.use('/', express.static("res"))
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    let auth = req.session;

    console.log("Login=" + auth.username + ":" + auth.password)

    if (!(auth && auth.username && auth.password)) {
        res.render("login.html", {
            chatServerUrl: config.chatServerUrl
        })
        return;
    }

    res.render("dashboard.html", {
        chatServerUrl: config.chatServerUrl,
        username: auth.username,
        password: auth.password
    })
})

app.get('/announcements', (req, res) => {
    let auth = req.session;
    
    res.render("announcements-main.html", {
        chatServerUrl: config.chatServerUrl,
        username: auth.username,
        password: auth.password
    })
})

app.get('/threads', (req, res) => {
    let auth = req.session;
    
    res.render("announcements-thread.html", {
        chatServerUrl: config.chatServerUrl,
        username: auth.username,
        password: auth.password
    })
})

app.get('/posts', (req, res) => {
    let auth = req.session;
    
    res.render("announcements-post.html", {
        chatServerUrl: config.chatServerUrl,
        username: auth.username,
        password: auth.password
    })
})

app.get('/feedback', (req, res) => {
    let auth = req.session;
    
    res.render("feedback.html", {
        chatServerUrl: config.chatServerUrl,
        username: auth.username,
        password: auth.password
    })
})

app.get("/test", (req, res) => {
    req.session.s = req.session.s || 1
    req.session.s++;
    res.json({
        count: req.session.s
    })
})
app.get("*", (req, res) => {
    console.log("Error 404: " + req.url);
    res.redirect("/");
})

app.post("/storage", (req, res) => {
    console.log(jsonCircle(req.body, 4))
    let content = req.body || {}
    for (let key in content) {
        req.session[key] = content[key] || ""
    }
    res.json({
        status: 200
    })
})

app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))






















function jsonCircle(obj, spacing) {
    var cache = [];
    var str = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, spacing);
    cache = null;
    return str;
}