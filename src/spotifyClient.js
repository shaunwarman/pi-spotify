export function getUser(fn, ...args) {
    return fn.apply(null, 'https://api.spotify.com/v1/me', args);
}