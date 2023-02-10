import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { Cell } from '@/pages/nonogram';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

interface Props {
  setStep: Dispatch<SetStateAction<'editor' | 'viewer'>>;
  board: Cell[][];
}
function NonogramViewer({ setStep, board }: Props) {
  const [gameBoard, setGameBoard] = useState(board.map((_line) => _line.map((_cell) => ({ ..._cell, state: 0 }))));
  const [isClear, setIsClear] = useState(false);

  const collectCheckBoard = useMemo(() => board.map((_line) => _line.map((_item) => !!_item.color)), [board]);
  const answerCheckBoard = useMemo(
    () => gameBoard.map((_line) => _line.map((_item) => _item.state === 1)),
    [gameBoard]
  );

  const horizonHint = useMemo(() => {
    return board
      .reduce(
        (acc, _line, _cI) => {
          _line.forEach((_item, _i) => {
            const _l = acc[acc.length - 1];

            if (_item.color) {
              _l[_l.length - 1]++;
            } else if (!_item.color && _l[_l.length - 1] !== 0) {
              _l.push(0);
            }

            if (_i === _line.length - 1 && _cI !== board.length - 1) {
              acc.push([0]);
            }
          });

          return acc;
        },
        [[0]]
      )
      .map((_line) => _.compact(_line));
  }, [board]);

  const verticalHint = useMemo(() => {
    const result = [[0]];

    for (let i = 0; i < board[0].length; i++) {
      for (let j = 0; j < board.length; j++) {
        const _l = result[result.length - 1];
        const _item = board[j][i];

        if (_item.color) {
          _l[_l.length - 1]++;
        } else if (!_item.color && _l[_l.length - 1] !== 0) {
          _l.push(0);
        }

        if (j === board[j].length - 1 && i !== board.length - 1) {
          result.push([0]);
        }
      }
    }

    return result.map((_line) => _.compact(_line));
  }, [board]);

  useEffect(() => {
    if (_.isEqual(collectCheckBoard, answerCheckBoard)) {
      alert('clear..!');
      setIsClear(true);
    }
  }, [collectCheckBoard, answerCheckBoard]);

  const handleSetPos = (_pos) => {
    setGameBoard((_prev) => {
      const copied = _.cloneDeep(_prev);

      let _item = copied[_pos[1]][_pos[0]];

      _item.state = _item.state < 2 ? _item.state + 1 : 0;
      console.log(_item.state);

      return copied;
    });
  };

  return (
    <div>
      <button onClick={() => setStep('editor')}>이전</button>
      <div className={cx('board-wrap')}>
        <div className={cx('vertical')}>
          {verticalHint.map((_line) => (
            <div style={{ width: 450 / board[0].length }}>
              <p dangerouslySetInnerHTML={{ __html: _line.join('\n') }} />
            </div>
          ))}
        </div>

        <div className={cx('horizon')}>
          {horizonHint.map((_line) => (
            <div style={{ height: 450 / board[0].length }}>
              <p>{_line.join(' ')}</p>
            </div>
          ))}
        </div>
        <div
          className={cx('board')}
          style={{
            gridTemplateColumns: `repeat(${board[0].length}, ${450 / board[0].length}px)`,
          }}
        >
          {gameBoard.map((_line, _y) =>
            _line.map((_val, _x) => (
              <div
                key={`${_x}-${_y}-${_val}`}
                className={cx(`cell-state-${_val.state}`)}
                style={{
                  transitionDelay: isClear ? `${_y * 0.1}s` : '0s',
                  ...(isClear && { backgroundColor: _val.color }),
                }}
                onClick={() => handleSetPos([_x, _y])}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NonogramViewer;
