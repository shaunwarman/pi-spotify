import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { helloHandler, getUserInfo, loginHandler } from './lib/handlers';
import { plugins } from './plugins/plugins';
import { viewOptions } from './plugins/options/view';

// create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register([
    Vision,
    plugins.cache,
    plugins.logging
], (err) => {
    console.log(viewOptions);
    server.views(viewOptions);
});

// add routes
server.route({
    method: 'GET',
    path: '/',
    handler: helloHandler
});

server.route({
    method: 'GET',
    path:'/login',
    handler: loginHandler
});

server.route({
    method: 'GET',
    path:'/callback',
    handler: getUserInfo
});

// start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.info('Server running at:', server.info.uri);
});