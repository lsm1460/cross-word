import { AppDataSource } from './data-source';
import * as express from 'express';
import userRouter from './api/routes/UserRouter';
import crossWordRouter from './api/routes/CrossWordRouter';
import cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {})
  .catch((error) => console.log(error));

app.use('/api', userRouter);

app.use('/api', crossWordRouter);

app.listen(5000, () => {
  console.log('Server running');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
