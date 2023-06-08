import classNames from 'classnames/bind';
import styles from './chartItem.module.scss';
const cx = classNames.bind(styles);
//
import {
  CONNECT_POINT_GAP,
  CONNECT_POINT_SIZE,
  CONNECT_POINT_START,
  FLOW_CHART_ITEMS_STYLE,
} from '@/consts/codeFlowLab/items';
import { ChartItems } from '@/consts/types/codeFlowLab';
import { useMemo } from 'react';

interface Props {
  itemInfo: ChartItems;
}
function ChartItem({ itemInfo }: Props) {
  return (
    <div
      className={cx('chart-item')}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,
        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,
        minHeight:
          FLOW_CHART_ITEMS_STYLE[itemInfo.elType].height +
          Math.max(
            (itemInfo.connectionIds?.right || []).length - 1,
            Math.max((itemInfo.connectionIds?.left || []).length - 1, 0)
          ) *
            (CONNECT_POINT_GAP + CONNECT_POINT_SIZE),
        zIndex: itemInfo.zIndex,
      }}
    >
      {FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectorPosition.map(([_x, _y], _i) => (
        <ul
          key={_i}
          style={{
            [_y]: CONNECT_POINT_START,
            [_x]: 0,
            transform: _x === 'right' ? 'translateX(50%)' : 'translateX(-50%)',
          }}
        >
          {Array(itemInfo.connectionIds[_x].length + 1)
            .fill(undefined)
            .map((__, _j) => (
              <li
                key={`${_i}-${_j}`}
                style={{
                  height: 0,
                  marginTop: CONNECT_POINT_GAP + CONNECT_POINT_SIZE,
                }}
              >
                <span
                  style={{
                    width: CONNECT_POINT_SIZE,
                    height: CONNECT_POINT_SIZE,
                  }}
                />
              </li>
            ))}
        </ul>
      ))}
    </div>
  );
}

export default ChartItem;