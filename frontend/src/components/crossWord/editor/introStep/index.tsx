import { CROSS_WORD_EDITOR_STEP } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import _ from 'lodash';

const MAX_WIDTH_SIZE = 10;

type WordItem = { dir: 'horizon' | 'vertical'; x1: number; x2: number; y1: number; y2: number; key: string };
type WordTableType = { [key: string]: WordItem };

interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_EDITOR_STEP>>;
}
function IntroStep({ setEditorStep }: Props) {
  // const handleStartEdit = () => {
  //   setEditorStep('body');
  // };
  const wordList = [
    '트라우마',
    '라텍스',
    '에스키모',
    '모내기',
    '에로스',
    '스님',
    '님비현상',
    '비듬',
    '실현',
    '상대성이론',
    '금성',
    '대들보',
  ];

  const reverseDir = (_dir) => (_dir === 'vertical' ? 'horizon' : 'vertical');

  const checkCollapse = (_wordBoard: WordTableType, _item: WordItem): boolean => {
    const pos: { x: number; y: number; key: string }[] = [];

    const _keys = Object.keys(_wordBoard);

    for (let i = 0; i < _keys.length; i++) {
      const tmp = _wordBoard[_keys[i]];

      if (!tmp) {
        continue;
      }

      // 평행인 경우 제외
      if (Math.max(tmp.x1, tmp.x2) < Math.min(_item.x1, _item.x2)) continue;
      if (Math.min(tmp.x1, tmp.x2) > Math.max(_item.x1, _item.x2)) continue;
      if (Math.max(tmp.y1, tmp.y2) < Math.min(_item.y1, _item.y2)) continue;
      if (Math.min(tmp.y1, tmp.y2) > Math.max(_item.y1, _item.y2)) continue;

      const p1 = (tmp.x1 - tmp.x2) * (_item.y1 - _item.y2) - (tmp.y1 - tmp.y2) * (_item.x1 - _item.x2); //분모로 사용됨
      if (p1 !== 0) {
        let x = 0;
        let y = 0;

        x =
          ((tmp.x1 * tmp.y2 - tmp.y1 * tmp.x2) * (_item.x1 - _item.x2) -
            (tmp.x1 - tmp.x2) * (_item.x1 * _item.y2 - _item.y1 * _item.x2)) /
          p1;
        y =
          ((tmp.x1 * tmp.y2 - tmp.y1 * tmp.x2) * (_item.y1 - _item.y2) -
            (tmp.y1 - tmp.y2) * (_item.x1 * _item.y2 - _item.y1 * _item.x2)) /
          p1;

        if (
          (x - tmp.x1) * (x - tmp.x2) <= 0 &&
          (y - tmp.y1) * (y - tmp.y2) <= 0 && //교점이 1선분 위에 있고
          (x - _item.x1) * (x - _item.x2) <= 0 &&
          (y - _item.y1) * (y - _item.y2) <= 0 //교점이 2선분 위에 있을경우
        ) {
          pos.push({ x: x, y: y, key: _keys[i] });
        }
      } else {
        //일치한 경우
        return true;
      }
    }

    if (pos.length > 0) {
      for (let i = 0; i < pos.length; i++) {
        const _collapseItem = _wordBoard[pos[i].key];
        if (
          (_collapseItem.dir === 'horizon' &&
            _collapseItem.key[Math.abs(pos[i].x - _collapseItem.x1)] === _item.key[Math.abs(pos[i].y - _item.y1)]) ||
          (_collapseItem.dir === 'vertical' &&
            _collapseItem.key[Math.abs(pos[i].y - _collapseItem.y1)] === _item.key[Math.abs(pos[i].x - _item.x1)])
        ) {
          //충돌했지만 겹치는 부분이 같은 글자일 경우
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  const findHitKey = (_wordTable: WordTableType, _char: string[]): [string, number] => {
    const keys = _.reverse(Object.keys(_wordTable));
    let hitKey = '';
    let hitIndex = -1;

    for (let i = 0, hasWord = false; i < _char.length && !hasWord; i++) {
      for (let j = 0; j < keys.length; j++) {
        if (keys[j].split('').includes(_char[i])) {
          hitKey = keys[j];
          hitIndex = i;
          hasWord = true;
          break;
        }
      }
    }

    return [hitKey, hitIndex];
  };

  const findWordPosition = (
    _wordBoard: WordTableType,
    _hitKey: string,
    _word: string,
    _originBoard: WordTableType,
    _direction?: 'normal' | 'reverse'
  ): WordItem => {
    let _char = _word.split('');

    if (_direction === 'reverse') {
      _char = _.reverse(_char);
    }

    try {
      if (!_hitKey) {
        throw new Error('no hit key');
      }

      const _dir = reverseDir(_wordBoard[_hitKey].dir);

      let hitIndex = -1;
      let matchedIndex = -1;

      for (let i = 0; i < _char.length; i++) {
        if (_hitKey.indexOf(_char[i]) > -1) {
          hitIndex = _hitKey.indexOf(_char[i]);
          matchedIndex = _direction === 'reverse' ? _char.length - 1 - i : i;
          break;
        }
      }

      let item: WordItem = null;

      if (_dir === 'vertical') {
        const x = _wordBoard[_hitKey].x1 + hitIndex;

        item = {
          key: _word,
          dir: _dir,
          x1: x,
          x2: x,
          y1: _wordBoard[_hitKey].y1 - matchedIndex,
          y2: _wordBoard[_hitKey].y1 - matchedIndex + (_char.length - 1),
        };
      } else {
        const y = _wordBoard[_hitKey].y1 + hitIndex;

        item = {
          key: _word,
          dir: _dir,
          x1: _wordBoard[_hitKey].x1 - matchedIndex,
          x2: _wordBoard[_hitKey].x1 - matchedIndex + (_char.length - 1),
          y1: y,
          y2: y,
        };
      }

      const checkBoard = _.pick(
        _wordBoard,
        Object.keys(_wordBoard).filter((_k) => _k !== _hitKey)
      );
      if (checkCollapse(checkBoard, item)) {
        // 충돌이 났다면 다른 단어와 엮일 수 있는지 확인한다.
        let [_otherHitKey] = findHitKey(checkBoard, _char);

        if (_otherHitKey) {
          // 다른 단어와 엮일 수 있다면 위치를 다시 찾아본다.
          return findWordPosition(checkBoard, _otherHitKey, _word, _originBoard, 'reverse');
        } else {
          if (_direction !== 'reverse') {
            return findWordPosition(_originBoard, _hitKey, _word, _originBoard, 'reverse');
          } else {
            throw new Error('cant find pos');
          }
        }
      } else {
        return item;
      }
    } catch (e) {
      console.log(_word, e.message);
      // 빈 위치를 찾아 할당한다
    }
  };

  let board = [];
  let wordTable: WordTableType = {};

  wordList.forEach((_word) => {
    const char = _word.split('');

    if (_.isEmpty(wordTable)) {
      wordTable[_word] = {
        key: _word,
        dir: 'horizon',
        x1: 0,
        x2: char.length - 1,
        y1: 0,
        y2: 0,
      };
    } else {
      let [hitKey, _i] = findHitKey(wordTable, char);
      const wordItem = findWordPosition(wordTable, hitKey, _word, wordTable);

      wordTable[_word] = wordItem;
    }
  });

  console.log('wordTable', wordTable);

  return (
    <div>
      <p>Intro</p>

      {/* <button onClick={handleStartEdit}>start</button> */}
    </div>
  );
}

export default IntroStep;
