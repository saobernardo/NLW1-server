import express from 'express';
import path from 'path';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(cors(
    //origin: www.amarelo.com.br
))
app.use(express.json());
app.use(routes);

//imagens estáticas do sistema
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333);