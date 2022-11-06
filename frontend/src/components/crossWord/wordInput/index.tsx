import styles from './wordInput.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import _ from 'lodash';
import { BOARD_SIZE } from '@/consts/crossWord';

const WORD_DIRECTION = ['horizon', 'vertical'] as const;
type WordDirection = typeof WORD_DIRECTION[number];

interface Props {
  indexItem: { li: number; ii: number };
  board: string[][];
  setBoard: Dispatch<SetStateAction<string[][]>>;
  closeInput: () => void;
}
function WordInput({ indexItem, board, setBoard, closeInput }: Props) {
  const getDirection = (): WordDirection[] => {
    const result = [];

    if (board[indexItem.li][indexItem.ii - 1] || board[indexItem.li][indexItem.ii + 1]) {
      result.push('horizon');
    }

    if (board[indexItem.li - 1]?.[indexItem.ii] || board[indexItem.li + 1]?.[indexItem.ii]) {
      result.push('vertical');
    }

    if (_.isEmpty(result)) {
      if (BOARD_SIZE <= indexItem.li + 1) {
        return ['vertical'];
      } else if (BOARD_SIZE <= indexItem.ii + 1) {
        return ['horizon'];
      } else {
        return ['horizon', 'vertical'];
      }
    } else {
      return result;
    }
  };

  const [wordDirection, setWordDirection] = useState<WordDirection>(getDirection()[0] || 'horizon');
  const [answerWord, setAnswerWord] = useState('');

  useEffect(() => {
    setWordDirection(getDirection()[0]);
  }, [indexItem]);

  const handleSubmitAnswer = (_event) => {
    _event.preventDefault();

    const words = answerWord.trim().split('');

    if (
      (wordDirection === 'horizon' && words.length > BOARD_SIZE - indexItem.ii) ||
      (wordDirection === 'vertical' && words.length > BOARD_SIZE - indexItem.li)
    ) {
      alert('not enough blank');
      return;
    }

    setBoard((prev) => {
      const newBoard = _.cloneDeep(prev);

      words.forEach((_word, i) => {
        let _lineIndex = indexItem.li;
        let _itemIndex = indexItem.ii;

        if (wordDirection === 'horizon') {
          _itemIndex = _itemIndex + i;
        } else {
          _lineIndex = _lineIndex + i;
        }

        newBoard[_lineIndex][_itemIndex] = _word;
      });

      return newBoard;
    });
  };

  return (
    <div className={cx('word-editor')}>
      <button onClick={() => closeInput()}>close</button>
      <form onSubmit={handleSubmitAnswer}>
        <div>
          {WORD_DIRECTION.map((_dir) => (
            <div key={_dir}>
              <input
                type="radio"
                name="direction"
                value={_dir}
                checked={_dir === wordDirection}
                id={`radio-${_dir}`}
                onChange={(event) => setWordDirection(event.target.value as WordDirection)}
                disabled={!getDirection().includes(_dir)}
              />
              <label htmlFor={`radio-${_dir}`}>{_dir}</label>
            </div>
          ))}
        </div>
        <input type="text" value={answerWord} onChange={(event) => setAnswerWord(event.target.value)} />
        <button type="submit" disabled={answerWord.trim().split('').length < 2}>
          insert
        </button>
      </form>
    </div>
  );
}

export default WordInput;
