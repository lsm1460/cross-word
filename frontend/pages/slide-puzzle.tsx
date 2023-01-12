import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type Block = {
  width: number;
  position: {
    top: number;
    left: number;
  };
  correctIndex: number;
  nowIndex: number;
};

const BLOCK_WIDTH = 500;

const makeTwoDimensional = (_array, _size, _dummyIndex?) => {
  _dummyIndex && _array.splice(_dummyIndex, 0, undefined);

  const _tempBoard = [];

  for (let i = 0; i < _size; i++) {
    const _line = _array.splice(0, _size);
    _tempBoard.push(_line);
  }

  return _tempBoard;
};

function SlideBlock({ size, correctIndex, nowIndex, position, onClick }) {
  return (
    <div
      style={{
        top: position.top,
        left: position.left,
        position: 'absolute',
        width: BLOCK_WIDTH / size,
        height: BLOCK_WIDTH / size,
        transition: '.3s top, .3s left',
      }}
      onClick={onClick}
    >
      <b>{correctIndex}</b>
      <br />
      {nowIndex}
    </div>
  );
}

function SliderPuzzle() {
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState<Block[][]>(null);

  const blockWidth = BLOCK_WIDTH / size;

  const handleMake = () => {
    const randomIndex = _.shuffle(new Array(size * size).fill(0).map((n, i) => i));

    const _board = new Array(size * size)
      .fill({
        width: BLOCK_WIDTH / size,
        position: {
          top: 0,
          left: 0,
        },
        correctIndex: 0,
        nowIndex: 0,
      })
      .map((_item, _index) => {
        const nowIndex = randomIndex.pop();

        const rowIndex = Math.floor(nowIndex / size);
        const columnIndex = nowIndex % size;

        return {
          ..._item,
          correctIndex: _index,
          nowIndex,
          position: {
            top: rowIndex * blockWidth,
            left: columnIndex * blockWidth,
          },
        };
      })
      .sort((_a, _b) => _a.nowIndex - _b.nowIndex);

    _board.pop();

    const _tempBoard = makeTwoDimensional(_board, size);

    setBoard(_tempBoard);
  };

  const slideBlock = (_x: number, _y: number) => {
    let moveDirection;
    let blankIndex;

    for (let i = 0; i < size; i++) {
      if (!board[_y][i] || !board[i][_x]) {
        if (!board[_y][i]) {
          moveDirection = i > _x ? 'right' : 'left';
        } else {
          moveDirection = i > _y ? 'down' : 'up';
        }
        blankIndex = i;

        break;
      }
    }

    setBoard((_prev) => {
      const _prevBoard = _.cloneDeep(_prev);
      let dummyIndex;

      switch (moveDirection) {
        case 'down':
          for (let i = _y; i < blankIndex; i++) {
            if (_prevBoard[i][_x]) {
              dummyIndex = _prevBoard[i][_x].nowIndex;

              const newIndex = _prevBoard[i][_x].nowIndex + size;
              const rowIndex = Math.floor(newIndex / size);

              _prevBoard[i][_x].nowIndex = newIndex;
              _prevBoard[i][_x].position.top = rowIndex * blockWidth;
            }
          }
          const _newBoard = _.flatten(_prevBoard).sort((a, b) => a.nowIndex - b.nowIndex);

          return makeTwoDimensional(_newBoard, size, dummyIndex);

        default:
          return _prev;
      }
    });
  };

  useEffect(() => {
    console.log(board);
  }, [board]);

  return (
    <div>
      <div>
        <input type="number" />

        <button onClick={handleMake}>make</button>
      </div>

      {board && (
        <div style={{ width: BLOCK_WIDTH, height: BLOCK_WIDTH, position: 'relative' }}>
          {board.map((_line, _y) =>
            _line.map(
              (_item, _x) =>
                _item && (
                  <SlideBlock
                    key={_item.correctIndex}
                    size={size}
                    correctIndex={_item.correctIndex}
                    nowIndex={_item.nowIndex}
                    position={_item.position}
                    onClick={() => slideBlock(_x, _y)}
                  />
                )
            )
          )}
        </div>
      )}
    </div>
  );
}

export default SliderPuzzle;
