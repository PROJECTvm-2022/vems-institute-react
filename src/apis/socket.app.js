import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import { CookieStorage } from 'cookie-storage';
import io from 'socket.io-client';
import services from './services.json';
import socketio from '@feathersjs/socketio-client';

export const authCookieName = 'ticket';

/**
 * CookieStorage
 * @type {CookieStorage}
 */
export const cookieStorage = new CookieStorage();

const socketClient = io('https://api.test.jupionclasses.com');

/**
 * Feathers application
 * @type {createApplication.Application<any>}
 */
const socketApp = feathers();

socketApp.configure(
    socketio(socketClient, {
        transports: ['websocket'],
    }),
);

socketApp.configure(
    auth({
        path: services.authentication,
        // cookie: process.env.NEXT_COOKIE_NAME,
        cookie: authCookieName,
        // storageKey: process.env.NEXT_COOKIE_NAME,
        storageKey: authCookieName,
        storage: cookieStorage,
    }),
);

export default socketApp;
