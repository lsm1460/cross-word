import { CROSS_WORD_EDITOR_STEP } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import _ from 'lodash';
import CrossWord from '../../../../utils/CrossWord';
import WordBoard from '../../board';

const MAX_WIDTH_SIZE = 10;

type WordItem = { dir: 'horizon' | 'vertical'; x1: number; x2: number; y1: number; y2: number; key: string };
type WordTableType = { [key: string]: WordItem };

interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_EDITOR_STEP>>;
}
function IntroStep({ setEditorStep }: Props) {
  // const handleStartEdit = () => {
  //   setEditorStep('body');
  // };
  const wordList = [
    '트라우마',
    '라텍스',
    '에스키모',
    '모내기',
    '에로스',
    '스님',
    '님비현상',
    '비듬',
    '실현',
    '상대성이론',
    '금성',
    '대들보',
    '피카츄',
    '츄카파브라',
    '스카이다이빙',
  ];

  // const wordList = ['비행기가밖으로날아갑', '배는바다위에떠있습니', '비배비배메롱메롱'];

  const wordTable = new CrossWord();

  wordTable.makePuzzle(wordList);

  const board = wordTable.getCrossWordBoard();

  return (
    <div>
      <p>Intro</p>

      <WordBoard boardType="editor" board={board} />
      {/* <button onClick={handleStartEdit}>start</button> */}
    </div>
  );
}

export default IntroStep;
