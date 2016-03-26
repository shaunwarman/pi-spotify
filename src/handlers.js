import keys from '../config/keys';
import { spotifyRequest } from './httpclient';
import querystring from 'querystring';
import * as util from './util';

export function loginHandler(request, reply) {
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

export function obtainOauth(request, reply) {
    
    return async function () {
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

        console.info(`POST ${options}`);
        const tokens = await spotifyRequest('POST', url, options);

        const { access_token, refresh_token } = JSON.parse(tokens);
        const bearerOption = {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        console.info(`POST ${bearerOption}`);
        const response = await spotifyRequest('GET', 'https://api.spotify.com/v1/me', bearerOption);
        console.info(`RESPONSE: ${response}`);
    }
}