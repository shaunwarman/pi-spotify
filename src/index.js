import Good from 'good';
import Hapi from 'hapi';
import Vision from 'vision';
import Wreck from 'wreck';

import { spotifyRequest } from './httpclient';
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
    handler: postHandler
});

async function postHandler(request, reply) {
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
    
    const tokens = await spotifyRequest('POST', url, options);
    
    const { access_token, refresh_token } = JSON.parse(tokens);
    const bearerOption = {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    const response = await spotifyRequest('GET', 'https://api.spotify.com/v1/me', bearerOption);
};

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