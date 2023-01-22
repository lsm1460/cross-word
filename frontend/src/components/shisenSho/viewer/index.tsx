import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

type ItemPos = [number, number];
type PathInfo = { pos: ItemPos; prev: string; prevList: ItemPos[] };

const SEARCH_DIR = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
] as const;
const CELL_SIZE = 50;

const getAngleCount = (_posList: ItemPos[]) => {
  if (_posList.length < 3) {
    // 점이 2개 이하로 왔을 때는 각도의 갯 수를 구할 수 없음
    return 0;
  }

  return _posList.reduce(
    (acc, cur, cI, arr) => {
      switch (cI) {
        case 0:
          return acc;
        case 1:
          return {
            dir: arr[0][0] === cur[0] ? 'y' : 'x',
            count: 0,
          };

        default:
          const dir = arr[cI - 1][0] === cur[0] ? 'y' : 'x';

          return {
            ...acc,
            dir,
            count: acc.dir === dir ? acc.count : acc.count + 1,
          };
      }
    },
    { dir: '', count: 0 }
  ).count;
};

interface Props {
  originBoard: number[][];
}
function ShisenShoViewer({ originBoard }: Props) {
  const [gameBoard, setGameBoard] = useState(originBoard);
  const [path, setPath] = useState<string[]>([]);
  const [startPos, setStartPos] = useState<ItemPos>(null);
  const [endPos, setEndPos] = useState<ItemPos>(null);
  const [shuffleCount, setShuffleCount] = useState(3);

  const hashMap: { [key: string]: { pos: ItemPos; closedNode: ItemPos[] } } = useMemo(
    () =>
      gameBoard
        .flatMap((_line, _y) => _line.map((_val, _x) => [_x, _y] as ItemPos))
        .reduce(
          (acc, cur) => ({
            ...acc,
            [cur.join()]: {
              pos: cur,
              closedNode: SEARCH_DIR.map((_dir) => [cur[0] + _dir[0], cur[1] + _dir[1]] as ItemPos).filter((_pos) =>
                _.isNumber(gameBoard[_pos[1]]?.[_pos[0]])
              ),
            },
          }),
          {}
        ),
    [gameBoard]
  );

  const polylinePoints = useMemo(() => {
    return path.reduce((acc, cur) => {
      const [_x, _y] = (cur || ',').split(',').map((_val) => parseInt(_val, 10) || 0);

      return (acc += ` ${_x * CELL_SIZE + CELL_SIZE / 2},${_y * CELL_SIZE + CELL_SIZE / 2}`);
    }, '');
  }, [path]);

  const findPath = (_start: ItemPos, _end: ItemPos) => {
    const visitedList = [];
    const visited: { [_pathKey: string]: PathInfo } = {},
      startVal = gameBoard[_start[1]][_start[0]],
      endVal = gameBoard[_end[1]][_end[0]];
    let needVisit: PathInfo[] = [],
      isSuccessFlag = false;

    if (startVal === endVal) {
      needVisit.push({ pos: _start, prev: null, prevList: [] });

      while (needVisit.length > 0) {
        const path = needVisit.shift();
        const _pathKey = path.pos.join();

        const count = getAngleCount([...path.prevList, path.pos]);

        if (path.pos[1] === _end[1] && path.pos[0] === _end[0] && count < 3) {
          isSuccessFlag = true;
          visited[_pathKey] = path;
          break;
        }

        if (count < 3 && !visitedList.includes(_pathKey)) {
          if (!needVisit.map((_need) => _need.pos.join()).includes(_pathKey)) {
            // 대기열에 남아있을 경우 탐색을 끝내지 않음 (같은 칸 이여도 탐색 히스토리가 다를 수 있음)
            visited[_pathKey] = path;
            visitedList.push(_pathKey);
          }

          const targetPos = hashMap[_pathKey].closedNode
            .filter((_node) => {
              const _val = gameBoard[_node[1]][_node[0]];

              // 0이거나 정답인 칸 탐색
              return _val < 1 || (_node[0] === _end[0] && _node[1] === _end[1]);
            })
            .map((_node) => ({ pos: _node, prev: _pathKey, prevList: [...path.prevList, path.pos] }));

          needVisit = [...needVisit, ...targetPos];
        }
      }
    }

    return [isSuccessFlag, visited];
  };

  useEffect(() => {
    if (startPos && endPos) {
      // 방향성 고정
      const _s = startPos[0] < endPos[0] ? startPos : endPos;
      const _e = startPos[0] < endPos[0] ? endPos : startPos;

      const [isSuccess, pathList] = findPath(_s, _e);

      if (isSuccess) {
        const _p = [...pathList[_e.join()].prevList, _e].map((_pos) => _pos.join());

        setPath(_p);

        setTimeout(() => {
          setGameBoard((prev) =>
            prev.map((_line, _y) =>
              _line.map((_val, _x) => {
                if ((_s[0] === _x && _s[1] === _y) || (_e[0] === _x && _e[1] === _y)) {
                  return 0;
                } else {
                  return _val;
                }
              })
            )
          );
          setPath([]);
          setStartPos(null);
          setEndPos(null);
        }, 200);
      } else {
        setStartPos(null);
        setEndPos(null);
      }
    }
  }, [startPos, endPos]);

  useEffect(() => {
    setGameBoard(originBoard);
    setShuffleCount(3);
  }, [originBoard]);

  useEffect(() => {
    const remainingScore = gameBoard.flat().reduce((acc, cur) => acc + cur, 0);

    if (remainingScore < 1) {
      alert('clear!');
    }
  }, [gameBoard]);

  const handleSetPos = (_pos: ItemPos) => {
    if (gameBoard[_pos[1]][_pos[0]] < 1) {
      return;
    }

    if (!startPos && !endPos) {
      setStartPos(_pos);
    } else if (startPos && !endPos && !_.isEqual(_pos, startPos)) {
      setEndPos(_pos);
    } else {
      // 같은 칸 클릭의 경우
    }
  };

  const handleShuffle = () => {
    if (shuffleCount < 1) {
      return;
    }

    const shuffledValues = _.shuffle(gameBoard.flat().filter((_v) => _v));

    const newBoard = gameBoard.map((_line) => _line.map((_v) => (_v > 0 ? shuffledValues.shift() : 0)));

    setGameBoard(newBoard);

    setShuffleCount((prev) => --prev);
  };

  return (
    <div className={cx('board-wrap')}>
      <div className={cx('board-position-wrap')}>
        <div
          className={cx('board')}
          style={{
            width: gameBoard[0].length * 50,
            gridTemplateColumns: `repeat(${gameBoard[0].length}, ${CELL_SIZE}px)`,
          }}
        >
          {gameBoard.map((_line, _y) =>
            _line.map((_val, _x) => (
              <div
                key={`${_x}-${_y}-${_val}`}
                onClick={() => handleSetPos([_x, _y])}
                className={cx({
                  'has-value': _val > 0,
                  active: _.isEqual([_x, _y], startPos) || _.isEqual([_x, _y], endPos),
                })}
              >
                <b>{_val > 0 ? _val : ''}</b>
                {/* <br />
                <span>
                  {_x},{_y}
                </span> */}
              </div>
            ))
          )}
        </div>
        <svg className={cx('line-inner')}>
          <polyline points={polylinePoints} />
        </svg>
      </div>

      <div>
        <button onClick={handleShuffle}>shuffle.. {`${shuffleCount}/3`}</button>
      </div>
    </div>
  );
}

export default ShisenShoViewer;
