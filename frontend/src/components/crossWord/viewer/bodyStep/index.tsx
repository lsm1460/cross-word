import classNames from 'classnames/bind';
import styles from './bodyStep.module.scss';
const cx = classNames.bind(styles);
//
import { CROSS_WORD_VIEWER_STEP } from '@/types';
import { Dispatch, SetStateAction } from 'react';

const initState: [string, string][] = [];
interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_VIEWER_STEP>>;
  hintList: string[];
}
function BodyStep({ setEditorStep, hintList }: Props) {
  return <></>;
}

export default BodyStep;
