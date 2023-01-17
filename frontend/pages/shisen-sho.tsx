import { useEffect, useState } from 'react';
import _ from 'lodash';

type Pos = [number, number];

const SEARCH_DIR = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
] as const;

function ShisenSho() {
  const [map] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 2, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const findPath = (startPos: Pos, endPos: Pos) => {
    const visited: Pos[] = [],
      endVal = map[endPos[1]][endPos[0]];
    let needVisit: Pos[] = [];

    needVisit.push(startPos);

    while (needVisit.length > 0) {
      const pos = needVisit.shift();

      if (map[pos[1]][pos[0]] === endVal && pos[1] === endPos[1] && pos[0] === endPos[0]) {
        visited.push(pos);
        break;
      }

      const visitedList = visited.map((_visit) => _visit.join());
      if (!visitedList.includes(pos.join())) {
        visited.push(pos);

        const targetPos = SEARCH_DIR.map((_dir) => [pos[0] + _dir[0], pos[1] + _dir[1]] as Pos)
          .filter((_pos) => {
            // 이동가능 여부 확인
            // TODO: 만들어지는 선분 갯수 3개가 이하 여부 확인 필요
            const mapVal = map[_pos[1]]?.[_pos[0]];

            return (mapVal === undefined ? 999 : mapVal) < 1 || mapVal === endVal;
          })
          .sort((a, b) => {
            // 목표점과의 방향 유사도 확인
            const xGap = Math.abs(endPos[0] - a[0]) - Math.abs(endPos[0] - b[0]);
            const yGap = Math.abs(endPos[1] - a[1]) - Math.abs(endPos[1] - b[1]);
            return xGap > yGap ? yGap : xGap;
          });

        needVisit = [...needVisit, ...targetPos];
      }
    }

    return visited;
  };

  useEffect(() => {
    const path = findPath([1, 2], [6, 3]);
    console.log(path);
  }, []);

  return <div></div>;
}

export default ShisenSho;
