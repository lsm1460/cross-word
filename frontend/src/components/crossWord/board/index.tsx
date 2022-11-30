import classNames from 'classnames/bind';
import styles from './board.module.scss';
const cx = classNames.bind(styles);
//
import { Board, QNBoard } from '@/consts/types';

interface Props {
  boardType: 'editor' | 'viewer';
  board: Board;
  numberBoard: QNBoard;
  selectedPos?: { x: number[]; y: number[] };
  onClickCell?: (_x: number, _y: number) => void;
}
function WordBoard({ boardType, board, numberBoard, selectedPos = { x: [], y: [] }, onClickCell }: Props) {
  if (!(board && numberBoard)) {
    return <p>loading..</p>;
  }

  const getCellColor = (_x, _y, _item) => {
    if (selectedPos.x.includes(_x) && selectedPos.y.includes(_y)) {
      return '#fde199';
    } else if (_item === null || _item.trim()) {
      return 'transparent';
    } else {
      return '#333333';
    }
  };

  return (
    <div className={cx('board-wrap')}>
      <div className={cx('board')}>
        {board.map((_line, _li) =>
          _line.map((_item, _ii) => (
            <div
              key={`${_li}-${_ii}-${_item}`}
              style={{
                backgroundColor: getCellColor(_ii, _li, _item),
                cursor: boardType === 'viewer' && _item === null ? 'pointer' : 'default',
              }}
              onClick={() => {
                onClickCell && onClickCell(_ii, _li);
              }}
            >
              <span className={cx('num')}>{numberBoard[_li][_ii] || ''}</span>
              <span className={cx('word')}>{_item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WordBoard;
