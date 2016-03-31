import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { getUserInfo, loginHandler } from './handlers';
import { plugins } from './plugins/plugins';

// create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register([
    Vision,
    plugins.cache
], (err) => {
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
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
    handler: getUserInfo
});

// start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.info('Server running at:', server.info.uri);
});