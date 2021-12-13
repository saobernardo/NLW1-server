import express from 'express';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

//basicamente permitir que as rotas sejam usadas fora do arquivo do arquivo principal
const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.delete('/points/:id', pointsController.delete);

export default routes;