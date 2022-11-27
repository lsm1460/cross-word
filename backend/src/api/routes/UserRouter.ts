import * as express from "express";
import UserController from "../controller/UserController";

const userRouter = express.Router();

let userController = new UserController();

userRouter.post("/user/adduser", userController.addUser);

export default userRouter;