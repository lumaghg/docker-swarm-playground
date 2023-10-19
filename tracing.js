//OpenTelemetry
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { JaegerPropagator } = require("@opentelemetry/propagator-jaeger");


//Exporter
module.exports = (serviceName) => {
    //const exporter = new ConsoleSpanExporter();
    const exporter = new JaegerExporter({ endpoint: "http://jaeger:14268/api/traces" })
    //const exporter = new OTLPTraceExporter({ url: "http://jaeger:4318/v1/traces" });
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({ propagator: new JaegerPropagator() });
    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new MongoDBInstrumentation(),
        ],
        tracerProvider: provider,
    });
    return trace.getTracer(serviceName);
};