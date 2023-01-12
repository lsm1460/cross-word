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
  _.isNumber(_dummyIndex) && _array.splice(_dummyIndex, 0, undefined);

  const _tempBoard = [];

  for (let i = 0; i < _size; i++) {
    const _line = _array.splice(0, _size);
    _tempBoard.push(_line);
  }

  return _tempBoard;
};

function SlideBlock({ size, correctIndex, nowIndex, left, top, onClick, imgUrl }) {
  const row = Math.floor(correctIndex / size);
  const col = correctIndex % size;

  return (
    <div
      style={{
        top: top,
        left: left,
        position: 'absolute',
        width: BLOCK_WIDTH / size,
        height: BLOCK_WIDTH / size,
        transition: '.3s all',
        backgroundColor: 'red',
        border: '2px solid #ffffff',
        cursor: 'pointer',
        backgroundImage: `url(${imgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `500px 500px`,
        backgroundPosition: `-${(500 / size) * col}px -${(500 / size) * row}px`,
        boxShadow: `0 0 3px 3px #dadce0`,
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
  const [count, setCount] = useState(0);
  const [size, setSize] = useState(3);
  const [imgUrl, setImgUrl] = useState('');
  const [board, setBoard] = useState<Block[][]>(null);

  const answer = useMemo(
    () =>
      new Array(size * size - 1)
        .fill(0)
        .map((n, i) => i)
        .join(''),
    [size]
  );

  const flatBoard = useMemo(
    () =>
      _.compact(_.flatten(board))
        .map((_block) => ({
          ..._block,
          x: _block.nowIndex % size,
          y: Math.floor(_block.nowIndex / size),
        }))
        .sort((_a, _b) => _a.correctIndex - _b.correctIndex),
    [board, size]
  );

  const blockWidth = BLOCK_WIDTH / size;

  const handleMake = () => {
    const randomIndex = _.shuffle(new Array(size * size - 1).fill(0).map((n, i) => i));

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
            top: Math.floor(rowIndex * blockWidth),
            left: Math.floor(columnIndex * blockWidth),
          },
        };
      })
      .sort((_a, _b) => _a.nowIndex - _b.nowIndex);

    _board.pop();

    const _tempBoard = makeTwoDimensional(_board, size);

    setBoard(_tempBoard);
  };

  const slideBlock = (_x: number, _y: number) => {
    setCount((prev) => prev + 1);

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
      let dummyIndex = _prevBoard[_y][_x].nowIndex;
      let _newBoard;

      switch (moveDirection) {
        case 'down':
          for (let i = _y; i < blankIndex; i++) {
            if (_prevBoard[i][_x]) {
              const newIndex = _prevBoard[i][_x].nowIndex + size;
              const rowIndex = Math.floor(newIndex / size);

              _prevBoard[i][_x].nowIndex = newIndex;
              _prevBoard[i][_x].position.top = Math.floor(rowIndex * blockWidth);
            }
          }

          break;
        case 'up':
          for (let i = _y; i > blankIndex; i--) {
            if (_prevBoard[i][_x]) {
              const newIndex = _prevBoard[i][_x].nowIndex - size;
              const rowIndex = Math.floor(newIndex / size);

              _prevBoard[i][_x].nowIndex = newIndex;
              _prevBoard[i][_x].position.top = Math.floor(rowIndex * blockWidth);
            }
          }

          break;
        case 'right':
          for (let i = _x; i < blankIndex; i++) {
            if (_prevBoard[_y][i]) {
              const newIndex = _prevBoard[_y][i].nowIndex + 1;
              const colIndex = newIndex % size;

              _prevBoard[_y][i].nowIndex = newIndex;
              _prevBoard[_y][i].position.left = Math.floor(colIndex * blockWidth);
            }
          }

          break;
        case 'left':
          for (let i = _x; i > blankIndex; i--) {
            if (_prevBoard[_y][i]) {
              const newIndex = _prevBoard[_y][i].nowIndex - 1;
              const colIndex = newIndex % size;

              _prevBoard[_y][i].nowIndex = newIndex;
              _prevBoard[_y][i].position.left = Math.floor(colIndex * blockWidth);
            }
          }

          break;
        default:
          return _prev;
      }

      _newBoard = _.flatten(_prevBoard).sort((a, b) => a.nowIndex - b.nowIndex);

      return makeTwoDimensional(_newBoard, size, dummyIndex);
    });
  };

  const handleSetImage = (_event: React.ChangeEvent<HTMLInputElement>) => {
    const url = URL.createObjectURL(_event.target.files[0]);

    setImgUrl(url);
  };

  useEffect(() => {
    if (answer === _.compact(_.flatten(board)).reduce((acc, cur) => acc + cur.correctIndex, '')) {
      alert('clear!');
    }
  }, [answer, board]);

  return (
    <div>
      <div>
        <p>3~6까지 값을 입력 가능</p>
        <input type="file" accept="image/*" onChange={handleSetImage} />
        <input
          type="number"
          value={size}
          onChange={(_event) => setSize(Math.max(3, Math.min(6, parseInt(_event.target.value, 10))))}
        />

        <button onClick={handleMake}>make</button>
      </div>

      <p>count: {count}</p>
      {board && (
        <div style={{ width: BLOCK_WIDTH, height: BLOCK_WIDTH, position: 'relative' }}>
          {_.compact(flatBoard).map((_item, _x) => (
            <SlideBlock
              key={_item.correctIndex}
              size={size}
              correctIndex={_item.correctIndex}
              nowIndex={_item.nowIndex}
              left={_item.position.left}
              top={_item.position.top}
              imgUrl={imgUrl}
              onClick={() => slideBlock(_item.x, _item.y)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SliderPuzzle;
