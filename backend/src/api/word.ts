import express from 'express';

const router = express.Router();

router.get('/get-definition', (req, res) => {
  const { word } = req.query;

  let result = [];

  if (typeof word === 'object') {
    result = (word as string[]).map((_word, _i) => ({ word: _word, definition: ['텟스트임' + _i] }));
  } else {
    result.push({ word: word, definition: ['테스트임'] });
  }

  return res.status(200).json(result);
});

export default router;
