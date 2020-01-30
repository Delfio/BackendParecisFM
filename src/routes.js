import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer'

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import BannerController from './app/controllers/BannerController';
import RadioController from './app/controllers/RadioController';

import PedidosController from './app/controllers/PedidosController';

import EstadosController from './app/controllers/EstadosController';
import CidadeController from './app/controllers/CidadeController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

const upload = multer(MulterConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.post('/musica/:id', PedidosController.store);

routes.use(authMiddlewares);

routes.post('/estados', EstadosController.store)
routes.post('/cidades', CidadeController.store)

routes.put('/users', UserController.update);
routes.post('/radio', RadioController.store);

routes.post('/banner/:id', upload.single('file'), BannerController.store);

export default routes;