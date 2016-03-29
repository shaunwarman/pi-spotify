import constants from './lib/constants';
import keys from '../config/keys';
import QS from 'querystring';
import { spotifyRequest } from './httpclient';
import { oauth } from './lib/tokenUtil';
import * as util from './util';

export function loginHandler(request, reply) {
    const state = util.generateRandomString(16);
    const stateKey = 'spotify_auth_state';

    reply.redirect('https://accounts.spotify.com/authorize?' +
        QS.stringify({
            response_type: 'code',
            client_id: keys.client_id,
            scope: keys.scopes,
            redirect_uri: keys.redirect_uri,
            state: state
        })
    )
}

export function getUserInfo(request, reply) {
    return async function () {
        const setupBearerToken = oauth(request, reply);
        const bearerOptions = await setupBearerToken();
        
        const userTracks = await spotifyRequest('GET', 'https://api.spotify.com/v1/me/tracks', bearerOptions);

        reply(userTracks);
    }
}