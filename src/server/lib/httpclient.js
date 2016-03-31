import Wreck from 'wreck';

/**
 * Generic http client for spotify api
 * 
 * @param options
 */
export function spotifyRequest(method, url, options) {
    
    return new Promise((resolve, reject) => {

        Wreck.request(method, url, options, (error, response) => {
            if (error) { reject(error); }

            Wreck.read(response, null, (error, body) => {
                if (error) {
                    console.error(`ERROR calling ${url} with error: ${error}`);
                    reject(error);
                } else {
                    resolve(body.toString('utf8'));
                }
            });
        });
    });
}