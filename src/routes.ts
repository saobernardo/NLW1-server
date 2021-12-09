import express from 'express';

//basicamente permitir que as rotas sejam usadas fora do arquivo do arquivo principal
const routes = express.Router();

routes.get('/users', (req, res) => {
    return res.json({message: "Hello World"})
});

export default routes;