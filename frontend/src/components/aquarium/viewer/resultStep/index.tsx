import classNames from 'classnames/bind';
import styles from './sketchStep.module.scss';
const cx = classNames.bind(styles);
//
import { AquariumViewerStep, FishInfo } from '@/consts/types/aquarium';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setViewerStep: Dispatch<SetStateAction<AquariumViewerStep>>;
  fish: FishInfo;
  setFish: Dispatch<SetStateAction<FishInfo>>;
}
function ResultStep({ setViewerStep, fish, setFish }: Props) {
  return (
    <div className={cx('sketch-step-wrap')}>
      <img src={fish.img} />
    </div>
  );
}

export default ResultStep;
