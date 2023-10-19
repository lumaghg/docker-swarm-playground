const tracer = require("./tracing")("todo-service");
const express = require('express')
const dotenv = require('dotenv')
const api = require("@opentelemetry/api");
const { W3CTraceContextPropagator } = require("@opentelemetry/core");
const { JaegerPropagator } = require("@opentelemetry/propagator-jaeger");


dotenv.config()



const app = express()

app.get('/', (req, res) => {
    res.send("This is Version 10.0\n<br>This is the time: " + new Date())
})

app.get('/health', async (req, res) => {
    const span = tracer.startSpan('healthcheck...', { startTime: Date.now() })
    console.log('/health called')
    await new Promise(resolve => setTimeout(resolve, 1000));
    span.end()

    res.json({ headers: JSON.stringify(req.headers) })
})

app.get('/crash', (req, res) => {
    tracer.startActiveSpan('crashing', span => {
        span.addEvent('starting operation')

        span.addEvent('crashed!', {
            'custom.testattr'
                : 'meeeeeem hier kann der request body hin :)', 'custom.headers': JSON.stringify(req.headers), 'custom.baseurl': JSON.stringify(req.baseUrl)
        })
        span.setStatus({ code: api.SpanStatusCode.ERROR })
        span.end()

        res.status(500).send("CRASH!")
    })
})

console.log("starting up...")
setTimeout(() => {
    app.listen(process.env.port, () => {
        console.log(`Example app listening on port ${process.env.port}`)

    })

}, 10000)
