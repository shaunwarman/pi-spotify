import constants from './constants';
import keys from '../../../config/keys';
import QS from 'querystring';
import { spotifyRequest } from './httpclient';
import { bearerToken } from './tokenUtil';
import * as util from './utils';

export function helloHandler(request, reply) {

    return reply.view('hello', { title: 'Herro', message: 'How goes it!' });
}

export function loginHandler(request, reply) {
    const state = util.generateRandomString(16);
    const stateKey = 'spotify_auth_state';

    return reply.redirect('https://accounts.spotify.com/authorize?' +
        QS.stringify({
            response_type: 'code',
            client_id: keys.client_id,
            scope: keys.scopes,
            redirect_uri: keys.redirect_uri,
            state: state
        })
    );
}

export async function getUserInfo(request, reply) {
    const bearerOptions = await bearerToken(request, reply);
    
    const { items } = JSON.parse(await spotifyRequest('GET', 'https://api.spotify.com/v1/me/tracks', bearerOptions));
    
    reply.view('user', { items });
}