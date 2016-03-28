import { constants } from './constants';
import keys from '../../config/keys';
import QS from 'querystring';
import { spotifyRequest } from '../httpclient';

export function obtainOauth(request, reply) {

    return async function () {
        const url = constants.TOKEN_URL;
        const options = setupClientSecret(request);

        try {
            const tokens = await spotifyRequest('POST', url, options);
    
            const { access_token, refresh_token } = JSON.parse(tokens);
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
}

function setupClientSecret(request) {
    const payload = {
        grant_type: constants.AUTH_CODE,
        code: request.query.code,
        redirect_uri: `${keys.redirect_uri}`
    };

    const clientString = `${keys.client_id}:${keys.secret}`;
    const clientSecret = new Buffer(clientString).toString('base64');
    
    const options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${clientSecret}`
        },
        payload: QS.stringify(payload)
    };
    
    return options;
}