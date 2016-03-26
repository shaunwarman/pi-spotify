import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { loginHandler, obtainOauth } from './handlers'
import loggingOptions from './logging'

// Create a server with a host and port
const server = new Hapi.Server();
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
});
server.register({
    register: Good,
    options: loggingOptions
}, (err) => {
    if (err) {
        console.error(err);
    }
});
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: (request, reply) => reply('helloooo')
});

server.route({
    method: 'GET',
    path:'/login',
    handler: loginHandler
});

/**
 * POST to obtain OAUTH token
 */
server.route({
    method: 'GET',
    path:'/callback',
    handler: (request, reply) => obtainOauth(request, reply)()
});

server.route({
    method: 'GET',
    path:'/authorize',
    handler: (request, reply) => {
        reply('authorize!')
    }
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.info('Server running at:', server.info.uri);
});