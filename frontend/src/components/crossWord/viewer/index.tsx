import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { CrossWordViewerStep, MakerData } from '@/consts/types';
import { useState } from 'react';
import BodyStep from './bodyStep';
import IntroStep from './introStep';
import ResultStep from './resultStep';

interface Props {
  makerData: MakerData;
}
function CrossWordViewer({ makerData }: Props) {
  const [editorStep, setEditorStep] = useState<CrossWordViewerStep>('intro');
  const [nickname, setNickname] = useState('');

  return (
    <div className={cx('editor-wrap')}>
      {editorStep === 'intro' && <IntroStep setEditorStep={setEditorStep} setNickname={setNickname} />}
      {editorStep === 'body' && <BodyStep setEditorStep={setEditorStep} makerData={makerData} />}
      {editorStep === 'result' && <ResultStep />}
    </div>
  );
}

export default CrossWordViewer;
