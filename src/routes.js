import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer'

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import BannerController from './app/controllers/BannerController';
import RadioController from './app/controllers/RadioController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

const upload = multer(MulterConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.use(authMiddlewares);

routes.put('/users', UserController.update);
routes.post('/radio', RadioController.store);

routes.post('/banner/:id', upload.single('file'), BannerController.store);

export default routes;