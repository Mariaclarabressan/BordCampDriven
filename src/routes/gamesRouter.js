import { Router } from "express"; 
import { getGames, postGame } from "../controller/gameController.js";
import {gameMiddleware} from '../middlewares/gameMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games',gameMiddleware, postGame);

export default gamesRouter;