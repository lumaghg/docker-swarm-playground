const tracer = require("./tracing")("swarm-hello-world");
const express = require('express')
const dotenv = require('dotenv')
const api = require("@opentelemetry/api");

dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.send("Timestamp: " + new Date())
})

app.get('/health', async (req, res) => {
    const span = tracer.startSpan('healthcheck', { startTime: Date.now() })
    await new Promise(resolve => setTimeout(resolve, 1000));
    span.end();

    res.json({ healthy: true });
})

app.get('/crash', (req, res) => {
    tracer.startActiveSpan('simulate crash', span => {
        span.addEvent('starting operation');

        try {
            throw new Error("CRASH!");
        } catch (e) {
            span.addEvent('operation crashed!', {
                'message': e.message,
                'request_headers': JSON.stringify(req.headers)
            })
            span.setStatus({ code: api.SpanStatusCode.ERROR })

            res.status(500).send("CRASH!")
        }
        finally {
            span.end()
        }
    })
})

console.log("starting up...")
app.listen(4000, () => {
    console.log(`Example app listening on port ${process.env.port}`)

})


