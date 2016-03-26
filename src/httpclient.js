import Wreck from 'wreck';

/**
 * Generic http client POST for spotify api
 * 
 * @param options
 */
export function spotifyRequest(method, url, options) {
    console.info(`IN POST with ${method}`);
    
    return new Promise((resolve, reject) => {

        Wreck.request(method, url, options, (error, response) => {
            if (error) { reject(error); }

            Wreck.read(response, null, (error, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body.toString('utf8'));
                }
            });
        });
    });
}