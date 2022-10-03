import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/indexRouter.js';
const server = express();



dotenv.config();

server.use(cors());
server.use(json());

server.use(router);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Servidor está funcionando'));