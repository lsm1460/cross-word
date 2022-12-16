import * as express from 'express';
import CrossWordController from '../controller/CrossWordController';

const crossWordRouter = express.Router();

let crossWordController = new CrossWordController();

crossWordRouter.get('/word/getword', crossWordController.getWord);
crossWordRouter.post('/word/savegame', crossWordController.saveGame);

crossWordRouter.get('/word/getgamelist', crossWordController.getGameList);
crossWordRouter.get('/word/getgame', crossWordController.getGame);

crossWordRouter.post('/word/saveparticipation', crossWordController.saveParticipation);

export default crossWordRouter;
