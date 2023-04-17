const { Tracer, BatchRecorder, jsonEncoder, Annotation } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const CLSContext = require('zipkin-context-cls');
const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'web-consumer-service';

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: 'http://localhost:9411/api/v2/spans',
    jsonEncoder: jsonEncoder.JSON_V2
  })
});

const tracer = new Tracer({ ctxImpl, recorder, localServiceName });

module.exports = tracer;


// Tracer configure karna: Zipkin tracing system mein, humein ek tracer object create karna hota hai. Ye tracer humare application ke requests ko trace karta hai aur trace data ko Zipkin server par bhejta hai. Is step mein hum tracer object ko configure kar rahe hain.

// Zipkin se required classes/functions ko import karte hain.
// ZIPKIN_ENDPOINT variable mein Zipkin server ka URL define karte hain.
// BatchRecorder instance create karte hain. Ye recorder trace data ko batches mein Zipkin server par bhejne ke liye responsible hota hai.
// Tracer instance create karte hain, jismein hum context implementation aur recorder pass karte hain. Tracer instance tracing information ko capture, process aur store karne ke liye use hota hai.Jab hum Tracer instance create karte hain, to hume do cheezein pass karni hoti hain:
// Context Implementation: Ye ek mechanism hota hai jiski madad se tracing information ko har request ke saath associate kiya jata hai. Node.js mein, hum CLS (Continuation Local Storage) context implementation ka use kar sakte hain. CLS ek method hai jisse hum tracing data ko request ke lifecycle ke dauraan track aur manage kar sakte hain. Is example mein, hum CLSContext ka use kar rahe hain.

// Recorder: Recorder ek component hota hai jiska kaam hota hai captured trace data ko process karke Zipkin server par bhejna. Is example mein, hum BatchRecorder ka use kar rahe hain. BatchRecorder trace data ko batches mein collect karke Zipkin server par bhejta hai, jisse performance improve hoti hai.

// Tracer instance create karte waqt, hum context implementation aur recorder ko pass karke Tracer class ke ek instance (object) ko configure kar rahe hain
// Tracer instance ko export karte hain, taaki hum isse dusri files mein use kar sakein.