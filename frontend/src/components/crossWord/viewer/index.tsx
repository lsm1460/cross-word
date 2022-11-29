import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { CROSS_WORD_VIEWER_STEP } from '@/types';
import { useState } from 'react';
import BodyStep from './bodyStep';
import IntroStep from './introStep';
import ResultStep from './resultStep';

interface Props {
  hintList: string[];
}
function CrossWordViewer({ hintList }: Props) {
  const [editorStep, setEditorStep] = useState<CROSS_WORD_VIEWER_STEP>('intro');
  const [nickname, setNickname] = useState('');

  return (
    <div className={cx('editor-wrap')}>
      {editorStep === 'intro' && <IntroStep setEditorStep={setEditorStep} setNickname={setNickname} />}
      {editorStep === 'body' && <BodyStep setEditorStep={setEditorStep} hintList={hintList} />}
      {editorStep === 'result' && <ResultStep />}
    </div>
  );
}

export default CrossWordViewer;
