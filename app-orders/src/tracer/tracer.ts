import { trace } from "@opentelemetry/api";

const OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME;

if (!OTEL_SERVICE_NAME) {
  throw new Error("env OTEL_SERVICE_NAME is not defined");
}

export const tracer = trace.getTracer(OTEL_SERVICE_NAME);
