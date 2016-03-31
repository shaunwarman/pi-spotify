import { constants } from './constants';
import keys from '../../../config/keys';
import QS from 'querystring';
import { spotifyRequest } from './httpclient';

export async function bearerToken(request, reply) {
    
    try {
        const { access_token, refresh_token } = JSON.parse(await getToken(request));
        
        // cache refresh token
        request.yar.set('refresh_token', { refresh_token });
        
        const bearerOption = {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        return bearerOption;
    } catch (exception) {
        console.error(exception);
    }
}

async function getToken(request) {
    const url = constants.TOKEN_URL;
    const options = setupClientSecret(request);

    try {
        const tokens = await spotifyRequest('POST', url, options);
        
        return tokens;
    } catch (exception) {
        console.error(exception);
    }
}

function setupClientSecret(request) {
    const payload = {
        grant_type: constants.AUTH_CODE,
        code: request.query.code,
        redirect_uri: `${keys.redirect_uri}`
    };

    const clientString = `${keys.client_id}:${keys.secret}`;
    const clientSecret = new Buffer(clientString).toString('base64');
    
    return {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${clientSecret}`
        },
        payload: QS.stringify(payload)
    };
}