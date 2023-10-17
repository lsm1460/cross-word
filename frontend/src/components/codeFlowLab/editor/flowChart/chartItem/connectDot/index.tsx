import classNames from 'classnames/bind';
import styles from './connectDot.module.scss';
const cx = classNames.bind(styles);
//
import { CONNECT_POINT_CLASS } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { MouseEventHandler } from 'react';

interface Props {
  parentId: string;
  connectDir: 'left' | 'right';
  connectType: ChartItemType;
  index: number;
  typeIndex: number;
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
  connectParentId?: string;
  isSlave?: boolean;
}
function ConnectDot({
  parentId,
  connectDir,
  connectType,
  index,
  typeIndex,
  connectParentId,
  isSlave,
  handlePointConnectStart,
}: Props) {
  return (
    <span
      className={cx('dot', connectType, {
        [CONNECT_POINT_CLASS]: true,
      })}
      data-parent-id={parentId}
      data-connect-dir={connectDir}
      data-connect-type={connectType}
      data-index={index || 0}
      data-type-index={typeIndex || 0}
      {...(connectParentId && {
        'data-connect-parent-id': connectParentId,
      })}
      {...(isSlave && {
        'data-is-slave': 1,
      })}
      onMouseDown={handlePointConnectStart}
    />
  );
}

export default ConnectDot;
