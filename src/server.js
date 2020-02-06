import app from './app';

import { webSocket } from './websocket'

import http from 'http';

const server = http.Server(app)
webSocket(server);

server.listen(3333);