const tracer = require("tracer");

const logLevel = "debug";

let logger = tracer.console({
    level: logLevel,
    format: [
        `{{timestamp}}\t{{file}}:{{line}}\t{{title}}\t{{message}}`, //default format
        {
            error: `{{timestamp}}\t{{file}}:{{line}}\t{{title}}\t{{message}}\nCall Stack:\n{{stack}}`, // error format
        },
    ],
    dateformat: "dd/mm/yyyy HH:MM:ss",
    preprocess: (data) => {
        data.title = data.title.toUpperCase();
    },
    transport: (data) => {
        console.log(data.output);
    }
});

module.exports = logger;