import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import react, { Dispatch, SetStateAction, useRef, useState } from 'react';
import _ from 'lodash';
import { Cell } from '@/pages/nonogram';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const BOARD_MIN = 5;
const BOARD_MAX = 15;

interface Props {
  setStep: Dispatch<SetStateAction<'editor' | 'viewer'>>;
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
}
function NonogramEditor({ setStep, setBoard }: Props) {
  const dataRef = useRef<HTMLInputElement>(null);
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

  const handleSetCopiedData = () => {
    try {
      setBoard(JSON.parse(dataRef.current.value));

      setStep('viewer');
    } catch (e) {
      alert('fail to set data..');
    }
  };

  return (
    <div>
      {!tempBoard && (
        <div>
          <p>
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
          </p>
          <br />
          <p>
            or insert copied data..
            <br />
            <input type="text" ref={dataRef} />
            <button onClick={handleSetCopiedData}>set and start</button>
          </p>
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

          <CopyToClipboard
            text={JSON.stringify(tempBoard)}
            onCopy={() => {
              alert('복사되었습니다.');
            }}
          >
            <button>copy</button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export default NonogramEditor;
