import { helloHandler, loginHandler, getUserInfo } from '../lib/handlers';

export const routes = {
    hello: {
      method: 'GET',
      path: '/',
      handler: helloHandler
    },
    login: {
        method: 'GET',
        path:'/login',
        handler: loginHandler
    },
    userInfo: {
        method: 'GET',
        path:'/callback',
        handler: getUserInfo
    }
};