import classNames from 'classnames/bind';
import styles from './bodyStep.module.scss';
const cx = classNames.bind(styles);
//
import { CrossWordViewerStep, MakerData } from '@/consts/types';
import { saveParticipation } from '@/src/utils/api';
import _ from 'lodash';
import { useRouter } from 'next/dist/client/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Board } from '../../../../../consts/types/index';
import WordBoard from '../../board';
import HintList from '../../hintList';
import AnswerModal from './answerModal';

export type SelectedPos = {
  dir: 'horizon' | 'vertical';
  x: number[];
  y: number[];
  num: number;
};

interface Props {
  playerNickname: string;
  setEditorStep: Dispatch<SetStateAction<CrossWordViewerStep>>;
  makerData: MakerData;
  startTime: number;
}
function BodyStep({ playerNickname, startTime, setEditorStep, makerData }: Props) {
  const router = useRouter();

  const [board, setBoard] = useState<Board>(makerData.board);
  const [selectedPos, setSelectedPos] = useState<SelectedPos>(undefined);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    if (isSave) {
      saveParticipation(router.query.id as string, board, playerNickname, new Date().getTime() - startTime)
        .then((_res) => {
          if (_res) {
            alert('clear..!');
            setEditorStep('result');
          } else {
            alert('wrong answer..!');
          }
        })
        .catch(() => {
          alert('fail to save..!');
        })
        .finally(() => {
          setIsSave(false);
        });
    }
  }, [isSave]);

  const onClickCell = (_x: number, _y: number) => {
    for (let i = 0; i < makerData.wordPos.length; i++) {
      const _pos = makerData.wordPos[i];

      const _xr = _.range(_pos.x1, _pos.x2 + 1);
      const _yr = _.range(_pos.y1, _pos.y2 + 1);

      if (!selectedPos) {
        if (_xr.includes(_x) && _yr.includes(_y)) {
          setSelectedPos({
            dir: _pos.dir,
            num: _pos.num,
            x: _xr,
            y: _yr,
          });

          break;
        }
      } else {
        if (
          _xr.includes(_x) &&
          _yr.includes(_y) &&
          (!selectedPos.x.includes(_x) || !selectedPos.y.includes(_y) || _pos.dir !== selectedPos.dir)
        ) {
          setSelectedPos({
            dir: _pos.dir,
            num: _pos.num,
            x: _xr,
            y: _yr,
          });

          break;
        }
      }
    }
  };

  const closeModal = () => {
    setSelectedPos(undefined);
  };

  const onSubmit = (_answer: string) => {
    const char = _answer.split('');

    setBoard((_prev) => {
      const copiedBoard = _.cloneDeep(_prev);

      if (selectedPos.dir === 'horizon') {
        const _y = selectedPos.y[0];

        selectedPos.x.forEach((_x, _i) => {
          copiedBoard[_y][_x] = char[_i];
        });
      } else {
        const _x = selectedPos.x[0];

        selectedPos.y.forEach((_y, _i) => {
          copiedBoard[_y][_x] = char[_i];
        });
      }

      return copiedBoard;
    });

    closeModal();
  };

  const handleCheckAnswer = () => {
    const answerList = _.flatten(board);

    for (let i = 0; i < answerList.length; i++) {
      if (!answerList[i]) {
        alert('보드가 완성되지 않았습니다.');
        return;
      }
    }

    setIsSave(true);
  };

  return (
    <div>
      <WordBoard
        boardType="viewer"
        board={board}
        numberBoard={makerData.qNBoard}
        onClickCell={onClickCell}
        selectedPos={selectedPos}
      />
      <HintList hintGroup={makerData.hintList} />
      <AnswerModal
        isOpen={!!selectedPos}
        selectedPos={selectedPos}
        hintList={makerData.hintList}
        onSubmit={onSubmit}
        closeModal={closeModal}
      />
      <button onClick={handleCheckAnswer}>submit</button>
    </div>
  );
}

export default BodyStep;
