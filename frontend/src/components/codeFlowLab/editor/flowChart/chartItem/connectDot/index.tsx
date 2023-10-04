import classNames from 'classnames/bind';
import styles from './connectDot.module.scss';
const cx = classNames.bind(styles);
//
import { CONNECT_POINT_CLASS } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { MouseEventHandler } from 'react';

interface Props {
  id: string;
  parentId: string;
  connectDir: 'left' | 'right';
  connectType: ChartItemType;
  index: number;
  typeIndex: number;
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
  connectId?: string;
}
function ConnectDot({
  id,
  parentId,
  connectDir,
  connectType,
  index,
  typeIndex,
  connectId,
  handlePointConnectStart,
}: Props) {
  return (
    <span
      className={cx('dot', {
        [CONNECT_POINT_CLASS]: true,
      })}
      id={id}
      data-parent-id={parentId}
      data-connect-dir={connectDir}
      data-connect-type={connectType}
      data-index={index || 0}
      data-type-index={typeIndex || 0}
      {...(connectId && {
        'data-connect-id': connectId,
      })}
      onMouseDown={handlePointConnectStart}
    />
  );
}

export default ConnectDot;
