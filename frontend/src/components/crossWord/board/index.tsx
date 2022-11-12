import styles from './board.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
interface Props {
  boardType: 'editor' | 'viewer';
  board: string[][];
}
function WordBoard({ boardType, board }: Props) {
  return (
    <div className={cx('board-wrap')}>
      <div className={cx('board')}>
        {board.map((_line, _li) =>
          _line.map((_item, _ii) => (
            <div
              key={`${_li}-${_ii}-${_item}`}
              style={{
                backgroundColor: _item.trim() ? 'transparent' : '#333',
                cursor: boardType === 'viewer' && _item.trim() ? 'pointer' : 'default',
              }}
            >
              <span>{_item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WordBoard;
