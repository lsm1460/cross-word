import classNames from 'classnames/bind';
import styles from './fishStep.module.scss';
const cx = classNames.bind(styles);
//
import { Dispatch, SetStateAction, useState, useRef, ElementRef } from 'react';
import { AquariumViewerStep } from '@/consts/types';
import FishLine from '../../fishLine/fishLine';
import { FishInfo } from '@/consts/types/aquarium';
import { FISH_LINE } from '@/consts/aquarium';
import Sketchbook from '../../sketchbook';

interface Props {
  setViewerStep: Dispatch<SetStateAction<AquariumViewerStep>>;
  setFish: Dispatch<SetStateAction<FishInfo>>;
}
function FishStep({ setViewerStep, setFish }: Props) {
  const sketchbookRef = useRef<ElementRef<typeof Sketchbook>>(null);

  const [drawInfo, setDrawInfo] = useState<{ index: number; line: typeof FISH_LINE[number] }>({
    index: 0,
    line: FISH_LINE[0],
  });

  const handleSubmit = async () => {
    const img = await sketchbookRef.current.getImage();
    setFish((prev) => ({
      ...prev,
      img,
    }));

    setViewerStep('result');
  };

  return (
    <div className={cx('fish-step-wrap')}>
      <Sketchbook line={drawInfo.line} ref={sketchbookRef} />

      <div className={cx('fish-bottom-wrap')}>
        <div className={cx('fish-select')}>
          <ul
            style={{
              width: 150 * FISH_LINE.length,
            }}
          >
            {FISH_LINE.map((_line, _index) => (
              <li key={_index}>
                <input
                  type="radio"
                  name="fish-line"
                  onChange={() => setDrawInfo({ index: _index, line: _line })}
                  id={`fish-line-${_index}`}
                  checked={_index === drawInfo.index}
                />
                <label htmlFor={`fish-line-${_index}`}>
                  <FishLine line={_line} />
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSubmit}>Naming</button>
      </div>
    </div>
  );
}

export default FishStep;
