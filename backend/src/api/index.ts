import express from 'express';
import wordRouter from './word';

const router = express.Router();

router.use('/api', wordRouter);

export default router;
