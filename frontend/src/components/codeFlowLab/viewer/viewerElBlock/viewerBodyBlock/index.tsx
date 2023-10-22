import classNames from 'classnames/bind';
import styles from './viewerBodyBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { RootState } from '@/reducers';
import { CSSProperties, ReactElement } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

interface Props {
  styles: CSSProperties;
  children: ReactElement[];
}
function ViewerBodyBlock({ styles, children }: Props) {
  const addedStyle = useSelector(
    (state: RootState) => state.mainDocument.addedStyles[`${ROOT_BLOCK_ID}-${state.mainDocument.sceneOrder}`],
    shallowEqual
  );

  return (
    <div className={cx('viewer-wrap')} style={{ ...styles, ...addedStyle }}>
      {children}
    </div>
  );
}

export default ViewerBodyBlock;
