/* TODO: 
  - 칸의 아이디와 라벨의 분리
  - 매칭된 칸은 맵에서 제거
*/

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

function ShisenShoViewer() {
  const [gameBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [path, setPath] = useState<string[]>([]);
  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);

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
      endVal = gameBoard[_end[1]][_end[0]];
    let needVisit: PathInfo[] = [],
      isSuccessFlag = false;

    needVisit.push({ pos: _start, prev: null, prevList: [] });

    while (needVisit.length > 0) {
      const path = needVisit.shift();
      const _pathKey = path.pos.join();

      const count = getAngleCount([...path.prevList, path.pos]);

      if (
        gameBoard[path.pos[1]][path.pos[0]] === endVal &&
        path.pos[1] === _end[1] &&
        path.pos[0] === _end[0] &&
        count < 3
      ) {
        isSuccessFlag = true;
        visited[_pathKey] = path;
        break;
      }

      if (!visitedList.includes(_pathKey) && count < 3) {
        visited[_pathKey] = path;
        visitedList.push(_pathKey);

        const targetPos = hashMap[_pathKey].closedNode
          .filter((_node) => {
            const _val = gameBoard[_node[1]][_node[0]];

            return _val < 1 || _val === endVal;
          })
          .map((_node) => ({ pos: _node, prev: _pathKey, prevList: [...path.prevList, path.pos] }));

        needVisit = [...needVisit, ...targetPos];
      }
    }

    return [isSuccessFlag, visited];
  };

  useEffect(() => {
    console.log(startPos, endPos);
    if (startPos && endPos) {
      const [isSuccess, pathList] = findPath(startPos, endPos);

      if (isSuccess) {
        const _p = Object.keys(pathList)
          .reverse()
          .reduce((acc, cur) => {
            if (acc.length < 1) {
              return [pathList[cur].prev, cur];
            }

            if (acc.includes(cur) && pathList[cur].prev) {
              return [pathList[cur].prev, ...acc];
            }

            return acc;
          }, [] as string[]);

        setPath(_p);
      } else {
        setStartPos(null);
        setEndPos(null);
      }
    }
  }, [startPos, endPos]);

  const handleSetPos = (_pos: ItemPos) => {
    console.log('??');
    if (!startPos && !endPos) {
      setStartPos(_pos);
    } else if (startPos && !endPos && !_.isEqual(_pos, startPos)) {
      setEndPos(_pos);
    } else {
      // 같은 칸 클릭의 경우
    }
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
              <div key={`${_x}-${_y}-${_val}`} onClick={() => handleSetPos([_x, _y])}>
                <b>{_val}</b>
                <br />
                <span>
                  {_x},{_y}
                </span>
              </div>
            ))
          )}
        </div>
        <svg className={cx('line-inner')}>
          <polyline points={polylinePoints} />
        </svg>
      </div>
    </div>
  );
}

export default ShisenShoViewer;
