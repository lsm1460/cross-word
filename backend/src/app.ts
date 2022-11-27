import { AppDataSource } from "./data-source"
import * as express from "express";
import userRouter from "./api/routes/UserRouter";
import crossWordRouter from "./api/routes/CrossWordRouter";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {})
  .catch((error) => console.log(error));

  app.use("/api", userRouter);
  
  app.use("/api", crossWordRouter);

app.listen(3000, () => {
  console.log("Server running");
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
