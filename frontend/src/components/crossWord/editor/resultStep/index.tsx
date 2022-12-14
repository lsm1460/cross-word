import classNames from 'classnames/bind';
import styles from './resultStep.module.scss';
const cx = classNames.bind(styles);
//
import { Board, CrossWordEditorStep, HintList as HintListType, QNBoard } from '@/consts/types';
import CrossWord, { WordItem, WordTableType } from '@/src/utils/CrossWord';
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import WordBoard from '../../board';
import HintList from '../../hintList';
import { postGameData } from '@/src/utils/api';
import { useRouter } from 'next/dist/client/router';

const initState = { horizon: [], vertical: [] };

interface Props {
  setEditorStep: Dispatch<SetStateAction<CrossWordEditorStep>>;
  wordList: string[];
  hintList: string[];
  nickname: string;
}
function ResultStep({ setEditorStep, wordList, hintList, nickname }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState<Board>(null);
  const [numberBoard, setNumberBoard] = useState<QNBoard>(null);
  const [wordPos, setWordPos] = useState<WordTableType>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>(null);
  const [qList, setQList] = useState([]);
  const [hintGroup, setHintGroup] = useState<HintListType>(null);

  useEffect(() => {
    const wordTable = new CrossWord();

    wordTable.makePuzzle(wordList);

    const _board = wordTable.getCrossWordBoard();
    const _wordPos = wordTable.getWordTable();
    const _startPos = wordTable.getStartPos();

    setWordPos(_wordPos);
    setBoard(_board);
    setStartPos(_startPos);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (board && wordPos && startPos) {
      let num = 0;

      const list = [];

      const setQuestionNum = (_x, _y) => {
        const _wordList = _.filter(wordPos, (_v) => _v.x1 === _x + startPos.x && _v.y1 === _y + startPos.y);

        if (_wordList.length > 0) {
          let n = ++num;

          _wordList.forEach((_word) => {
            list.push({ ..._word, num: n });
          });
        }
      };

      board.forEach((_line, _li) => {
        _line.forEach((_item, _ii) => {
          setQuestionNum(_ii, _li);
        });
      });

      setQList(list);
    }
  }, [board, wordPos, startPos]);

  useEffect(() => {
    if (qList && board) {
      const tempNumBoard: QNBoard = [];

      const setQuestionNum = (_x, _y) => {
        const _wordItem = _.find(wordPos, (_v) => _v.x1 === _x + startPos.x && _v.y1 === _y + startPos.y);

        let qNum = 0;

        if (_wordItem) {
          const _qItem = _.find(qList, (_q) => _q.key === _wordItem.key);

          qNum = _qItem?.num;
        }

        if (typeof tempNumBoard[_y] === 'undefined') {
          tempNumBoard[_y] = [];
        }

        tempNumBoard[_y][_x] = qNum;
      };

      board.forEach((_line, _li) => {
        _line.forEach((_item, _ii) => {
          setQuestionNum(_ii, _li);
        });
      });

      setNumberBoard(tempNumBoard);
    }
  }, [qList, board]);

  useEffect(() => {
    if (qList) {
      const ql = _.reduce(
        qList,
        (_acc, _q) => {
          const _wi = wordList.indexOf(_q.key);

          return {
            ..._acc,
            [_q.dir]: [..._acc[_q.dir], { question: hintList[_wi], num: _q.num, key: _q.key }],
          };
        },
        _.cloneDeep(initState)
      );

      setHintGroup(ql);
    }
  }, [qList]);

  const saveBoard = async () => {
    const _gameData = {
      qNBoard: numberBoard,
      hintList: _.mapValues(hintGroup, (_dirGroup) =>
        _.map(_dirGroup, (_item) => _.pickBy(_item, (_val, _key) => _key !== 'key'))
      ) as HintListType,
      wordPos: _.map(wordPos, (_item) => {
        let num = 0;

        for (let i = 0; i < hintGroup[_item.dir].length; i++) {
          const _wordItem = hintGroup[_item.dir][i];

          if (_wordItem.key === _item.key) {
            num = _wordItem.num;
            break;
          }
        }

        const deletedKeyItem = _.pickBy(_item, (_val, _key) => _key !== 'key');

        const positionFixedItem = _.mapValues(deletedKeyItem, (_val, _key) => {
          switch (_key) {
            case 'x1':
            case 'x2':
              return (_val as number) - startPos.x;
            case 'y1':
            case 'y2':
              return (_val as number) - startPos.y;

            default:
              return _val;
          }
        });

        return {
          ...positionFixedItem,
          num,
        };
      }) as WordItem[],
    };

    try {
      const _res = await postGameData(nickname, board, _gameData);

      router.push('/');
    } catch (e) {
      alert('Fail to save..');
    }
  };

  return (
    <>
      {isLoading && <p>loading..</p>}
      {!isLoading && board && (
        <div className={cx('result-wrap')}>
          <WordBoard boardType="editor" board={board} numberBoard={numberBoard} />
          <HintList hintGroup={hintGroup} />

          <button onClick={saveBoard}>save</button>
        </div>
      )}
    </>
  );
}

export default ResultStep;
