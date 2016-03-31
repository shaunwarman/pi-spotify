export const loggingOptions = {
    responsePayload: true,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }]
};