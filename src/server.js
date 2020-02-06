import app from './app';

import websocket from './websocket'

import http from 'http';

const server = http.Server(app)
websocket(server);

server.listen(3333);