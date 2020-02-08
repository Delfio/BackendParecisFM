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
import BannerPromocaoController from './app/controllers/BannerPromocaoController';

import PedidosController from './app/controllers/PedidosController';
import Top3Controller from './app/controllers/Top3Controller';
import ImageTop3Controller from './app/controllers/ImageTop3Controller';

import ContatoController from './app/controllers/ContatoController';

import EstadosController from './app/controllers/EstadosController';
import CidadeController from './app/controllers/CidadeController';

import ProgramacaoController from './app/controllers/ProgramacaoController';
import ProgramaController from './app/controllers/ProgramaController';
import DiaController from './app/controllers/DiasController';

import authMiddlewares from './app/middlewares/auth';
import DiasController from './app/controllers/DiasController';

const routes = new Router();

const upload = multer(MulterConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

//Realizar pedido pela api normalmente
routes.post('/musica/:id', PedidosController.store);
//Repetir pedido via top3
routes.post('/musica/:id/:pedidoId', PedidosController.store);
//Exibir notificações de acordo com a rádio

routes.get('/principal', RadioController.index);
routes.get('/principal/:id', PrincipalController.index);

routes.get('/programacaos/:id', ProgramacaoController.index);

routes.get('/top3/:id', Top3Controller.index);

routes.get('/promocao/:id', PromocaoController.index);

routes.get('/dias', DiasController.index)
routes.use(authMiddlewares);

routes.post('/programa', ProgramaController.store);
routes.get('/programa',ProgramaController.index);
routes.put('/programa/:id',ProgramaController.update);
routes.delete('/programa/:id',ProgramaController.delete);
routes.get('/programa/:id',ProgramaController.show);

routes.post('/dia', DiaController.store);
routes.post('/programacaos', ProgramacaoController.store);
routes.get('/programacaos', ProgramacaoController.index);
routes.delete('/programacaos/:id', ProgramacaoController.delete);
routes.put('/programacaos/:id', ProgramacaoController.update);
routes.get('/notifications/:radio_id', PedidosController.index);
routes.get('/notifications', PedidosController.index);
routes.get('/editProgramacao/:id', ProgramacaoController.show);

routes.post('/promocao/:id', PromocaoController.store);
routes.post('/bannerPromocao', upload.single('file'), BannerPromocaoController.store);
routes.delete('/promocao/:id', PromocaoController.delete);
routes.get('/promocao', PromocaoController.index);
routes.put('/promocao/:id', PromocaoController.update);
routes.get('/promocaoAtt/:id', PromocaoController.show);

routes.post('/top3/:id', Top3Controller.store);
routes.post('/imageTop3', upload.single('file'), ImageTop3Controller.store);
routes.put('/top3/:id', Top3Controller.update);
routes.get('/top3', Top3Controller.index);
routes.get('/top3Att/:id', Top3Controller.show);
routes.delete('/top3/:id', Top3Controller.delete);

routes.post('/contato/:id', ContatoController.store);
routes.put('/contato/:id', ContatoController.update);
routes.delete('/contato/:id', ContatoController.delete);
routes.get('/contato/:id', ContatoController.show);
routes.get('/contato', ContatoController.index);

routes.post('/estados', EstadosController.store)
routes.post('/cidades', CidadeController.store)
routes.get('/cidades', CidadeController.index)

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);

routes.post('/radio', RadioController.store);
routes.put('/radio/:id', RadioController.update);
routes.delete('/radio/:id', RadioController.delete);
routes.get('/radio/:id', RadioController.show);

routes.post('/banner/:id/:opcao', upload.single('file'), BannerController.store);
routes.post('/icon', upload.single('file'), IconController.store);
routes.post('/imageProfile', upload.single('file'), FotoPerfilController.store)
routes.put('/profileLocutor', LocutorController.update)
routes.get('/locutores/:id', LocutorController.index)


export default routes;