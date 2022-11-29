import { Board } from '@/consts/types';
import _ from 'lodash';

export type WordItem = {
  dir: 'horizon' | 'vertical';
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  key: string;
  num?: number;
};
export type WordTableType = { [key: string]: WordItem };

export default class CrossWord {
  MAX_WIDTH_SIZE = 10 as const;

  puzzleMaxWidth = 10;
  startTopPos = 0;
  startLeftPos = 0;
  endBottomPos = 0;
  questionNumber = 0;

  wordTable: WordTableType = {};
  board: Board = null;

  constructor(_maxSize: number = 10) {
    this.puzzleMaxWidth = _maxSize;
  }

  reverseDir = (_dir) => (_dir === 'vertical' ? 'horizon' : 'vertical');

  checkCollapse = (_wordBoard: WordTableType, _item: WordItem): boolean => {
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

  findHitKey = (_wordTable: WordTableType, _char: string[]): [string, number] => {
    const keys = Object.keys(_wordTable);
    let hitKey = '';
    let hitIndex = -1;

    for (let i = 0, hasWord = false; i < _char.length && !hasWord; i++) {
      for (let j = keys.length - 1; j > -1; j--) {
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

  findWordPosition = (
    _wordBoard: WordTableType,
    _hitKey: string,
    _word: string,
    _originBoard: WordTableType,
    _direction?: 'normal' | 'reverse'
  ): WordItem => {
    let _char = _word.split('');
    let qNum = 0;

    if (_direction === 'reverse') {
      _char = _.reverse(_char);
    }

    try {
      if (!_hitKey) {
        throw new Error('no hit key');
      }

      const _dir = this.reverseDir(_wordBoard[_hitKey].dir);

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
        const _x = _wordBoard[_hitKey].x1 + hitIndex;
        const _y = _wordBoard[_hitKey].y1 - matchedIndex;

        item = {
          key: _word,
          dir: _dir,
          x1: _x,
          x2: _x,
          y1: _y,
          y2: _y + (_char.length - 1),
        };
      } else {
        const _y = _wordBoard[_hitKey].y1 + hitIndex;
        const _x = _wordBoard[_hitKey].x1 - matchedIndex;

        if (_x + (_char.length - 1) > this.puzzleMaxWidth - 1) {
          throw new Error('word is overflowed');
        }

        item = {
          key: _word,
          dir: _dir,
          x1: _x,
          x2: _x + (_char.length - 1),
          y1: _y,
          y2: _y,
        };
      }

      if (this.checkCollapse(_wordBoard, item)) {
        // 충돌이 났다면 다른 단어와 엮일 수 있는지 확인한다.
        let [_otherHitKey] = this.findHitKey(_wordBoard, _char);

        if (_otherHitKey) {
          // 다른 단어와 엮일 수 있다면 위치를 다시 찾아본다.
          return this.findWordPosition(_wordBoard, _otherHitKey, _word, _originBoard, 'reverse');
        } else {
          if (_direction !== 'reverse') {
            return this.findWordPosition(_originBoard, _hitKey, _word, _originBoard, 'reverse');
          } else {
            throw new Error('cant find pos');
          }
        }
      } else {
        return item;
      }
    } catch (e) {
      console.log('this.board.length', this.board.length, _word);
      let _y = this.board.length + this.startTopPos + 1;
      let _x = 0;

      return {
        key: _word,
        dir: 'horizon',
        x1: _x,
        y1: _y,
        x2: _char.length - 1,
        y2: _y,
      };
    }
  };

  makeBoard = () => {
    let board = [];

    for (let i = 0; i < this.endBottomPos - this.startTopPos + 1; i++) {
      board.push(new Array(this.puzzleMaxWidth).fill(' '));
    }

    Object.values(this.wordTable).forEach((_wordItem) => {
      if (_wordItem) {
        const _yPos = _wordItem.y1 + Math.abs(this.startTopPos);
        const _xPos = _wordItem.x1 + Math.abs(this.startLeftPos);

        _wordItem.key.split('').forEach((_spelling, _i) => {
          if (_wordItem.dir === 'horizon') {
            board[_yPos][_xPos + _i] = _spelling;
          } else {
            board[_yPos + _i][_xPos] = _spelling;
          }
        });
      }
    });

    this.board = board;
  };

  makePuzzle = (_wordList: string[]) => {
    _wordList.forEach((_word) => {
      const char = _word.split('');

      if (_.isEmpty(this.wordTable)) {
        this.wordTable[_word] = {
          key: _word,
          dir: 'horizon',
          x1: 0,
          x2: char.length - 1,
          y1: 0,
          y2: 0,
        };
      } else {
        let [hitKey, _i] = this.findHitKey(this.wordTable, char);
        const wordItem = this.findWordPosition(this.wordTable, hitKey, _word, this.wordTable);

        this.startLeftPos = wordItem.x1 < this.startLeftPos ? wordItem.x1 : this.startLeftPos;
        this.startTopPos = wordItem.y1 < this.startTopPos ? wordItem.y1 : this.startTopPos;
        this.endBottomPos = wordItem.y2 > this.endBottomPos ? wordItem.y2 : this.endBottomPos;

        this.wordTable[_word] = wordItem;
      }

      this.makeBoard();
    });
  };

  getWordTable = () => this.wordTable;

  getCrossWordBoard = () => this.board;

  getStartPos = () => ({ x: this.startLeftPos, y: this.startTopPos });
}
