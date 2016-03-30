import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { getUserInfo, loginHandler } from './handlers';
import loggingOptions from './logging';

// create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// register handlebar templates
server.register(Vision, (error) => {
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
});

const options = {
    cookieOptions: {
        password: 'password123456789012345678901234567',
        isSecure: false
    }
};

// register session
server.register({
    register: require('yar'),
    options: options
}, function (err) { });


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