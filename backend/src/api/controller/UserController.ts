import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { Request, Response } from "express";

export default class UserController {
  addUser = async (req: Request, res: Response) => {
    let info = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
    };

    const userRepo = AppDataSource.getRepository(User);
    const user = userRepo.create(info);

    await userRepo
      .save(user)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  };
}