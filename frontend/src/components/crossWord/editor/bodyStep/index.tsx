import styles from './bodyStep.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { CROSS_WORD_EDITOR_STEP } from '@/types';
import WordInput from '../../wordInput';
import WordBoard from '../../board';

interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_EDITOR_STEP>>;
  board: string[][];
  setBoard: Dispatch<SetStateAction<string[][]>>;
}
function BodyStep({ setEditorStep, board, setBoard }: Props) {
  const [indexItem, setIndexItem] = useState<{ li: number; ii: number }>(null);

  const setWord = (_li: number, _ii: number) => {
    setIndexItem({
      li: _li,
      ii: _ii,
    });
  };

  return (
    <div className={cx('body-wrap')}>
      {indexItem && (
        <WordInput
          indexItem={indexItem}
          board={board}
          setBoard={setBoard}
          closeInput={() => {
            setIndexItem(null);
          }}
        />
      )}
      <WordBoard boardType="editor" board={board} setWord={setWord} />
    </div>
  );
}

export default BodyStep;
