import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { Dispatch, SetStateAction, useState } from 'react';
import _ from 'lodash';
import { Cell } from '@/pages/nonogram';

const BOARD_MIN = 5;
const BOARD_MAX = 15;

interface Props {
  setStep: Dispatch<SetStateAction<'editor' | 'viewer'>>;
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
}
function NonogramEditor({ setStep, setBoard }: Props) {
  const [size, setSize] = useState(8);
  const [tempBoard, setTempBoard] = useState(null);
  const [color, setColor] = useState('black');

  const handleMakeBoard = () => {
    setTempBoard(new Array(size).fill(undefined).map(() => new Array(size).fill({ color: '' })));
  };

  const handleSetPos = (_pos: number[]) => {
    setTempBoard((_prev) => {
      const copied = _.cloneDeep(_prev);

      if (copied[_pos[1]][_pos[0]].color) {
        copied[_pos[1]][_pos[0]] = { color: '' };
      } else {
        copied[_pos[1]][_pos[0]] = { color: color };
      }

      return copied;
    });
  };

  const handleComplete = () => {
    setBoard([...tempBoard]);

    setStep('viewer');
  };

  return (
    <div>
      {!tempBoard && (
        <div>
          <input
            value={size}
            onChange={(_event) => {
              setSize(Math.min(Math.max(parseInt(_event.target.value, 10), BOARD_MIN), BOARD_MAX));
            }}
            max={BOARD_MAX}
            min={BOARD_MIN}
            type={'number'}
          />
          <button onClick={handleMakeBoard}>make board</button>
        </div>
      )}
      {tempBoard && (
        <div>
          <div
            className={cx('board')}
            style={{
              gridTemplateColumns: `repeat(${tempBoard[0].length}, ${500 / tempBoard[0].length}px)`,
            }}
          >
            {tempBoard.map((_line, _y) =>
              _line.map((_val, _x) => (
                <div
                  key={`${_x}-${_y}-${_val}`}
                  style={{
                    backgroundColor: _val.color || 'transparent',
                  }}
                  onClick={() => handleSetPos([_x, _y])}
                />
              ))
            )}
          </div>
          <p>
            color: <input value={color} onChange={(_event) => setColor(_event.target.value.trim())} />
          </p>
          <br />
          <button onClick={handleComplete}>완성</button>
        </div>
      )}
    </div>
  );
}

export default NonogramEditor;
