export const loggingOptions = {
    reporters: [
        {
            init: function () { console.log('ready logging'); }
        },
        {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{log: '*', response: '*'}]
            }]
        }]
};