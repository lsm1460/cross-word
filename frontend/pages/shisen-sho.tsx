import ShisenShoViewer from '@/src/components/shisenSho/viewer';
import { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';

function ShisenSho() {
  const [boardSize, setBoardSize] = useState({ x: 5, y: 5 });
  const [numberOfType, setNumberOfType] = useState<number>(2);
  const [gameBoard, setGameBoard] = useState<number[][]>(null);

  const cellCount = useMemo(
    () => ((boardSize.x * boardSize.y) % 2 === 0 ? boardSize.x * boardSize.y : boardSize.x * boardSize.y - 1),
    [boardSize]
  );

  useEffect(() => {
    // 2로 초기화
    setNumberOfType(2);
  }, [cellCount]);

  const handleMakeBoard = () => {
    let _fillCount = cellCount % numberOfType === 0 ? cellCount : cellCount - (cellCount % 2);

    const typeCounts = [];

    for (let i = 0; i < numberOfType; i++) {
      if (i === numberOfType - 1) {
        const _last = typeCounts.reduce((acc, cur) => acc + cur, 0);
        typeCounts.push(_fillCount - _last);
      } else {
        const _c = Math.floor(_fillCount / numberOfType);
        typeCounts.push(_c % 2 === 0 ? _c : _c + 1);
      }
    }

    let valueList = typeCounts.map((_count, _i) => new Array(_count).fill(_i + 1)).flat();

    for (let j = 0; j < boardSize.x * boardSize.y - valueList.length; j++) {
      valueList.push(0);
    }

    valueList = _.shuffle(valueList);

    const board = new Array(boardSize.y + 2).fill(new Array(boardSize.x + 2).fill(0)).map((line, _i) => {
      if (_i === 0 || _i === boardSize.y + 1) {
        return line;
      } else {
        return line.map((_v, _i) => (_i === 0 || _i === line.length - 1 ? 0 : valueList.shift()));
      }
    });

    setGameBoard(board);
  };

  return (
    <div>
      <p>
        가로 (3~8)
        <input
          max={8}
          min={3}
          type="number"
          value={boardSize.x}
          onChange={(_event) => setBoardSize((prev) => ({ ...prev, x: parseInt(_event.target.value, 10) }))}
        />
      </p>
      <p>
        세로 (3~8)
        <input
          max={8}
          min={3}
          type="number"
          value={boardSize.y}
          onChange={(_event) => setBoardSize((prev) => ({ ...prev, y: parseInt(_event.target.value, 10) }))}
        />
      </p>
      <p>{cellCount}</p>
      <p>
        {`종류 수 (2~5)`}
        <input
          min={2}
          max={5}
          type="number"
          value={numberOfType}
          onChange={(_event) => setNumberOfType(Math.min(5, Math.max(parseInt(_event.target.value, 10), 2)))}
        />
      </p>
      <button onClick={handleMakeBoard}>만들기</button>
      {gameBoard && <ShisenShoViewer originBoard={gameBoard} />}
    </div>
  );
}

export default ShisenSho;
