import styles from './editor.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
import { CROSS_WORD_EDITOR_STEP } from '@/consts/types';
import { useState } from 'react';
import IntroStep from './introStep';
import BodyStep from './bodyStep';
import { BOARD_SIZE } from '@/consts/crossWord';

function CrossWordEditor() {
  const [editorStep, setEditorStep] = useState<CROSS_WORD_EDITOR_STEP>('intro');
  const [board, setBoard] = useState<string[][]>(
    new Array(BOARD_SIZE).fill(undefined).map(() => new Array(BOARD_SIZE).fill(''))
  );

  return (
    <div className={cx('editor-wrap')}>
      {editorStep === 'intro' && <IntroStep setEditorStep={setEditorStep} />}
      {editorStep === 'body' && <BodyStep setEditorStep={setEditorStep} board={board} setBoard={setBoard} />}
    </div>
  );
}

export default CrossWordEditor;
