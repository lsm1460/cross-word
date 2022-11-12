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
  return (
    <div className={cx('body-wrap')}>
      <WordBoard boardType="editor" board={board} />
    </div>
  );
}

export default BodyStep;
