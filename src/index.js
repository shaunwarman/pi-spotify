import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import keys from '../config/keys';
import loggingOptions from './logging'
import querystring from 'querystring';
import * as util from './util';

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
    handler: (request, reply) => {
        console.info('GET login');
        const state = util.generateRandomString(16);
        const stateKey = 'spotify_auth_state';

        reply.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: keys.client_id,
                scope: keys.scope,
                redirect_uri: keys.redirect_uri,
                state: state
            })
        )
    }
});

/**
 * POST to obtain OAUTH token
 */
server.route({
    method: 'GET',
    path:'/callback',
    handler: (request, reply) => {
        console.info('POST to obtain oauth token');
        console.info(`CODE ${request.query.code}`);
        const url = 'https://accounts.spotify.com/api/token';
        const payload = {
            grant_type: 'authorization_code',
            code: request.query.code,
            redirect_uri: 'http://localhost:8000/callback'
        };

        const clientString = `${keys.client_id}:${keys.secret}`;
        const clientSecret = new Buffer(clientString).toString('base64');
        let options = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${clientSecret}`
            },
            payload: querystring.stringify(payload)
        };

        console.info(`URL: ${url}`);
        console.info(`PAYLOAD: ${options.payload}`);
        console.info(`HEADERS: ${JSON.stringify(options.headers)}`);
        Wreck.request('POST', url, options, (error, response) => {
            if (error) {
                console.error(`POST error ${error}`);
                return;
            }

            Wreck.read(response, null, (error, body) => {
                if (error) {
                    console.error(`READ error ${error}`);
                } else {
                    console.info(`SUCCESS ${body.toString('utf8')}`);
                }
            });

        });
    }
});

server.route({
    method: 'GET',
    path:'/authorize',
    handler: (request, reply) => {
        console.info('authorize');
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