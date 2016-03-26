import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { loginHandler, obtainOauth } from './handlers'
import loggingOptions from './logging'

// create a server with a host and port
const server = new Hapi.Server();
server.register(Vision, (error) => {
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
});
server.connection({
    host: 'localhost',
    port: 8000
});

// add routes
server.route({
    method: 'GET',
    path:'/login',
    handler: loginHandler
});

server.route({
    method: 'GET',
    path:'/callback',
    handler: (request, reply) => obtainOauth(request, reply)()
});

// start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.info('Server running at:', server.info.uri);
});