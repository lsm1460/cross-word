import classNames from 'classnames/bind';
import styles from './resultStep.module.scss';
const cx = classNames.bind(styles);
//
import CrossWord, { WordTableType } from '@/src/utils/CrossWord';
import WordBoard from '../../board';
import { Dispatch, SetStateAction } from 'react';
import { CROSS_WORD_EDITOR_STEP } from '@/types';
import { useState, useEffect } from 'react';
import HintList from '../../hintList';
import _ from 'lodash';

interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_EDITOR_STEP>>;
  wordList: string[];
  hintList: string[];
  nickname: string;
}
function ResultStep({ setEditorStep, wordList, hintList, nickname }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState<string[][]>(null);
  const [wordPos, setWordPos] = useState<WordTableType>(null);
  const [startPos, setStartPos] = useState(null);
  const [qList, setQList] = useState([]);

  useEffect(() => {
    const wordTable = new CrossWord();

    wordTable.makePuzzle(wordList);

    const _board = wordTable.getCrossWordBoard();
    const _wordPos = wordTable.getWordTable();
    const _startPos = wordTable.getStartPos();

    setWordPos(_wordPos);
    setBoard(_board);
    setStartPos(_startPos);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (board && wordPos && startPos) {
      let num = 0;

      const list = [];

      const setQuestionNum = (_x, _y) => {
        const _wordList = _.filter(wordPos, (_v) => _v.x1 === _x + startPos.x && _v.y1 === _y + startPos.y);

        if (_wordList.length > 0) {
          let n = ++num;

          _wordList.forEach((_word) => {
            list.push({ ..._word, num: n });
          });
        }
      };

      board.forEach((_line, _li) => {
        _line.forEach((_item, _ii) => {
          setQuestionNum(_ii, _li);
        });
      });

      setQList(list);
    }
  }, [board, wordPos, startPos]);

  return (
    <>
      {isLoading && <p>loading..</p>}
      {!isLoading && board && (
        <div className={cx('result-wrap')}>
          <WordBoard boardType="editor" board={board} wordPos={wordPos} startPos={startPos} questionList={qList} />
          <HintList questionList={qList} wordList={wordList} hintList={hintList} />
        </div>
      )}
    </>
  );
}

export default ResultStep;
