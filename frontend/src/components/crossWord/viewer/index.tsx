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
  title: string;
  makerData: MakerData;
}
function CrossWordViewer({ title, makerData }: Props) {
  const [editorStep, setEditorStep] = useState<CrossWordViewerStep>('intro');
  const [nickname, setNickname] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  return (
    <div className={cx('editor-wrap')}>
      {editorStep === 'intro' && (
        <>
          <p>{title}</p>
          <IntroStep setEditorStep={setEditorStep} setNickname={setNickname} setStartTime={setStartTime} />
        </>
      )}
      {editorStep === 'body' && (
        <BodyStep setEditorStep={setEditorStep} makerData={makerData} startTime={startTime} setEndTime={setEndTime} />
      )}
      {editorStep === 'result' && <ResultStep />}
    </div>
  );
}

export default CrossWordViewer;
