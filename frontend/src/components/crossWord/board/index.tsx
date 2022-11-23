import classNames from 'classnames/bind';
import styles from './board.module.scss';
const cx = classNames.bind(styles);
//
import { WordItem, WordTableType } from '@/src/utils/CrossWord';
import _ from 'lodash';
import { useState } from 'react';

interface Props {
  boardType: 'editor' | 'viewer';
  board: string[][];
  wordPos: WordTableType;
  startPos: { x: number; y: number };
  questionList: WordItem[];
}
function WordBoard({ boardType, board, wordPos, startPos, questionList }: Props) {
  const getQuestionNum = (_x, _y) => {
    const _wordItem = _.find(wordPos, (_v) => _v.x1 === _x + startPos.x && _v.y1 === _y + startPos.y);

    if (_wordItem) {
      const _qItem = _.find(questionList, (_q) => _q.key === _wordItem.key);

      return _qItem?.num;
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
                backgroundColor: _item.trim() ? 'transparent' : '#333',
                cursor: boardType === 'viewer' && _item.trim() ? 'pointer' : 'default',
              }}
            >
              <span className={cx('num')}>{getQuestionNum(_ii, _li)}</span>
              <span className={cx('word')}>{_item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WordBoard;
