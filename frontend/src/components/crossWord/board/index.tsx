import styles from './board.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
interface Props {
  boardType: 'editor' | 'viewer';
  board: string[][];
  setWord: (_lineIndex: number, _itemIndex: number) => void;
}
function WordBoard({ boardType, board, setWord }: Props) {
  return (
    <div className={cx('board-wrap')}>
      <div className={cx('board')}>
        {board.map((_line, _li) =>
          _line.map((_item, _ii) => (
            <div
              key={`${_li}-${_ii}-${_item}`}
              style={{
                backgroundColor: _item ? 'transparent' : '#333',
                cursor: (boardType === 'viewer' && _item) || boardType === 'editor' ? 'pointer' : 'default',
              }}
              onClick={(_event) => {
                if ((boardType === 'viewer' && _item) || boardType === 'editor') {
                  setWord(_li, _ii);
                }
              }}
            >
              {_item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WordBoard;
