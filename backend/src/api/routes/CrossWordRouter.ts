import * as express from "express";
import CrossWordController from "../controller/CrossWordController";

const crossWordRouter = express.Router();

let crossWordController = new CrossWordController();

crossWordRouter.get("/word/getword", crossWordController.getWord);

export default crossWordRouter;