const express = require('express')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

if (process.env.SECRETMODE === "DOCKER_SECRETS") {
    process.env.SECRET = fs.readFileSync('/run/secrets/playground_secret', 'utf8')
}

const app = express()

app.get('/', (req, res) => {
    res.send("This is Version 6.0\n<br>This is the Secret: " + process.env.SECRET + "<br>This is the time: " + new Date())
})

console.log("starting up...")
setTimeout(() => {
    app.listen(process.env.port, () => {
        console.log(`Example app listening on port ${process.env.port}`)
    })

}, 10000)
