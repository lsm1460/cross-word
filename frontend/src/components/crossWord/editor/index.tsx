import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { CrossWordEditorStep } from '@/consts/types';
import { useState } from 'react';
import BodyStep from './bodyStep';
import IntroStep from './introStep';
import ResultStep from './resultStep';

function CrossWordEditor() {
  const [editorStep, setEditorStep] = useState<CrossWordEditorStep>('intro');
  const [nickname, setNickname] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [hintList, setHintList] = useState<string[]>([]);

  return (
    <div className={cx('editor-wrap')}>
      {editorStep === 'intro' && <IntroStep setEditorStep={setEditorStep} setNickname={setNickname} />}
      {editorStep === 'body' && (
        <BodyStep setEditorStep={setEditorStep} setWordList={setWordList} setHintList={setHintList} />
      )}
      {editorStep === 'result' && (
        <ResultStep setEditorStep={setEditorStep} wordList={wordList} hintList={hintList} nickname={nickname} />
      )}
    </div>
  );
}

export default CrossWordEditor;
