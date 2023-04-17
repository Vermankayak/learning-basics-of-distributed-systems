const fetch = require("node-fetch");
const wrapFetch = require("zipkin-instrumentation-fetch");
const tracer = require("./tracer");

const zipkinFetch = wrapFetch(fetch, { tracer });
module.exports = zipkinFetch;

// External API calls ke liye Zipkin instrumentation: External API calls ko bhi trace karne ke liye, hum Zipkin instrumentation fetch wrapper ka use kar rahe hain. Isse humare external API calls ke tracing information ko bhi capture kiya jaa sakta hai.

// node-fetch aur zipkin-instrumentation-fetch se dependencies ko import karte hain.
// tracer.js se tracer instance ko import karte hain.
// wrapFetch function ka use karke fetch function ko wrap karte hain, jismein hum tracer object pass karte hain.
// Wrapped fetch function ko export karte hain, taaki hum isse dusri files mein use kar sakein.
