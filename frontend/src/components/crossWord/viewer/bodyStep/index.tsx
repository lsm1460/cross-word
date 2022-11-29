import classNames from 'classnames/bind';
import styles from './bodyStep.module.scss';
const cx = classNames.bind(styles);
//
import { CrossWordViewerStep, MakerData } from '@/consts/types';
import { Dispatch, SetStateAction } from 'react';
import WordBoard from '../../board';
import HintList from '../../hintList';

interface Props {
  setEditorStep: Dispatch<SetStateAction<CrossWordViewerStep>>;
  makerData: MakerData;
}
function BodyStep({ setEditorStep, makerData }: Props) {
  return (
    <div>
      <WordBoard boardType="viewer" board={makerData.board} numberBoard={makerData.qNBoard} />
      <HintList hintGroup={makerData.hintList} />
    </div>
  );
}

export default BodyStep;
