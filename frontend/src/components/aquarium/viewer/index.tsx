import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { AquariumViewerStep } from '@/consts/types';
import { FishInfo } from '@/consts/types/aquarium';
import { useState } from 'react';
import FishStep from './fishStep/index';
import IntroStep from './introStep';
import ResultStep from './resultStep';

function AquariumViewer() {
  const [viewerStep, setViewerStep] = useState<AquariumViewerStep>('intro');
  const [fish, setFish] = useState<FishInfo>(null);
  const [fishes, setFishes] = useState([]);

  return (
    <div className={cx('viewer-wrap')}>
      {viewerStep === 'intro' && <IntroStep setViewerStep={setViewerStep} fishes={fishes} />}
      {viewerStep === 'sketch' && <FishStep setViewerStep={setViewerStep} setFish={setFish} />}
      {viewerStep === 'result' && <ResultStep setViewerStep={setViewerStep} fish={fish} setFish={setFish} />}
    </div>
  );
}

export default AquariumViewer;
