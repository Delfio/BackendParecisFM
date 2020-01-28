import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer'

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

const upload = multer(MulterConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.use(authMiddlewares);

routes.put('/users', UserController.update);

routes.post('/banner', upload.single('file'),(req, res) => {
  return res.json({ok: true});
})

export default routes;