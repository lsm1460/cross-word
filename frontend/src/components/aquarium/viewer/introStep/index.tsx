import classNames from 'classnames/bind';
import styles from './introStep.module.scss';
const cx = classNames.bind(styles);
//
import { Dispatch, SetStateAction } from 'react';
import { AquariumViewerStep } from '@/consts/types';
import Fishbowl from '../../fishbowl';
import { FishInfo } from '@/consts/types/aquarium';

interface Props {
  setViewerStep: Dispatch<SetStateAction<AquariumViewerStep>>;
  fishes: FishInfo[];
}
function IntroStep({ setViewerStep, fishes }: Props) {
  return (
    <div className={cx('intro-wrap')}>
      <Fishbowl fishes={fishes} />
      <button onClick={() => setViewerStep('sketch')}>Add Fish</button>
    </div>
  );
}

export default IntroStep;
