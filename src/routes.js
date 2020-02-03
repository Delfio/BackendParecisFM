import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer'

import PrincipalController from './app/controllers/PrincipalController';

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import BannerController from './app/controllers/BannerController';
import IconController from './app/controllers/IconController';

import FotoPerfilController from './app/controllers/FotoPerfilLocutor';
import LocutorController from './app/controllers/LocutorController';

import RadioController from './app/controllers/RadioController';
import PromocaoController from './app/controllers/PromocaoController';

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

routes.get('/principal', RadioController.index);
routes.get('/principal/:id', PrincipalController.index);

routes.get('/programacaos/:id', ProgramacaoController.index);

routes.use(authMiddlewares);

routes.post('/programa', ProgramaController.store);
routes.get('/programa',ProgramaController.index);
routes.put('/programa/:id',ProgramaController.update);
routes.delete('/programa/:id',ProgramaController.delete);

routes.post('/dia', DiaController.store);
routes.post('/programacaos', ProgramacaoController.store);
routes.get('/programacaos', ProgramacaoController.index);
routes.delete('/programacaos/:id', ProgramacaoController.delete);
routes.put('/programacaos/:id', ProgramacaoController.update);

routes.post('/promocao/:id', PromocaoController.store);

routes.post('/estados', EstadosController.store)
routes.post('/cidades', CidadeController.store)

routes.put('/users', UserController.update);

routes.post('/radio', RadioController.store);
routes.put('/radio/:id', RadioController.update);
routes.delete('/radio/:id', RadioController.delete);

routes.post('/banner/:id', upload.single('file'), BannerController.store);
routes.post('/icon', upload.single('file'), IconController.store);
routes.post('/imageProfile', upload.single('file'), FotoPerfilController.store)
routes.put('/profileLocutor', LocutorController.update)
routes.get('/locutores', LocutorController.index)


export default routes;