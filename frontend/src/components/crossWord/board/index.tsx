import classNames from 'classnames/bind';
import styles from './board.module.scss';
const cx = classNames.bind(styles);
//
import { Board, QNBoard } from '@/consts/types';

interface Props {
  boardType: 'editor' | 'viewer';
  board: Board;
  numberBoard: QNBoard;
}
function WordBoard({ boardType, board, numberBoard }: Props) {
  if (!(board && numberBoard)) {
    return <p>loading..</p>;
  }

  return (
    <div className={cx('board-wrap')}>
      <div className={cx('board')}>
        {board.map((_line, _li) =>
          _line.map((_item, _ii) => (
            <div
              key={`${_li}-${_ii}-${_item}`}
              style={{
                backgroundColor: _item === null || _item.trim() ? 'transparent' : '#333',
                cursor: boardType === 'viewer' && _item === null ? 'pointer' : 'default',
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
