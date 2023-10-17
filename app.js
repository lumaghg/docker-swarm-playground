const tracer = require("./tracing")("todo-service");
const express = require('express')
const dotenv = require('dotenv')
const api = require("@opentelemetry/api");
const { W3CTraceContextPropagator } = require("@opentelemetry/core");
const { JaegerPropagator } = require("@opentelemetry/propagator-jaeger");

/* Set Global Propagator */
//api.propagation.setGlobalPropagator(new JaegerPropagator());

dotenv.config()



//const activeSpan = api.trace.getSpan(api.context.active())
//activeSpan.addEvent('started!', { randomIndex: 1 })

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
    res.status(500).send("CRASH!")
})

console.log("starting up...")
setTimeout(() => {
    app.listen(process.env.port, () => {
        console.log(`Example app listening on port ${process.env.port}`)

    })

}, 10000)
