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

      <p>
        이름:
        <input
          type="text"
          onChange={(_event) => setFish((_prev) => ({ ..._prev, name: _event.target.value.trim() }))}
          value={fish.name}
          placeholder={'물고기 이름을 지어주세요'}
        />
      </p>
      <p>
        설명:
        <textarea
          onChange={(_event) => setFish((_prev) => ({ ..._prev, desc: _event.target.value }))}
          value={fish.desc}
        />
      </p>
    </div>
  );
}

export default ResultStep;
