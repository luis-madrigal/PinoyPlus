const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

app.set('view engine', 'pug')

app.use(cors({
    credentials: true,
    origin: true
}))
app.use('/', express.static("res"))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/dashboard.html'))
})

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/dashboard.html'))
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))