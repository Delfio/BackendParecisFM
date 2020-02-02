import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer'

import PrincipalController from './app/controllers/PrincipalController';

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import BannerController from './app/controllers/BannerController';

import FotoPerfilController from './app/controllers/FotoPerfilLocutor';

import RadioController from './app/controllers/RadioController';

import PedidosController from './app/controllers/PedidosController';

import EstadosController from './app/controllers/EstadosController';
import CidadeController from './app/controllers/CidadeController';

import ProgramacaoController from './app/controllers/ProgramacaoController';
import ProgramaController from './app/controllers/ProgramaController';
import DiaController from './app/controllers/DiasController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

const upload = multer(MulterConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.post('/musica/:id', PedidosController.store);

routes.get('/principal/:id', PrincipalController.index);

routes.use(authMiddlewares);

routes.post('/programa', ProgramaController.store);
routes.post('/dia', DiaController.store);

routes.post('/programacaos', ProgramacaoController.store);

routes.post('/estados', EstadosController.store)
routes.post('/cidades', CidadeController.store)

routes.put('/users', UserController.update);

routes.post('/radio', RadioController.store);

routes.post('/banner/:id', upload.single('file'), BannerController.store);
routes.post('/profile', upload.single('file'), FotoPerfilController.store)

export default routes;