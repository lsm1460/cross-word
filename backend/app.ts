import express from 'express';
import router from './src/api';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
