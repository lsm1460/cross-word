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
import { ChartItems, PointPos } from '@/consts/types/codeFlowLab';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  itemInfo: ChartItems;
  setSelectedConnectionPoint: Dispatch<SetStateAction<PointPos>>;
}
function ChartItem({ itemInfo, setSelectedConnectionPoint }: Props) {
  return (
    <div
      className={cx('chart-item')}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,
        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,
        minHeight:
          FLOW_CHART_ITEMS_STYLE[itemInfo.elType].height +
          Math.max(itemInfo.connectionIds.length - 1, 0) * (CONNECT_POINT_GAP + CONNECT_POINT_SIZE),
        zIndex: itemInfo.zIndex,
      }}
    >
      <ul
        style={{
          [FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectorPosition[0]]: CONNECT_POINT_START,
          [FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectorPosition[1]]: 0,
          transform:
            FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectorPosition[1] === 'right'
              ? 'translateX(50%)'
              : 'translateX(-50%)',
        }}
      >
        {Array(itemInfo.connectionIds.length + 1)
          .fill(undefined)
          .map((__, _i) => (
            <li
              key={_i}
              style={{
                height: 0,
                marginTop: CONNECT_POINT_GAP + CONNECT_POINT_SIZE * _i,
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
    </div>
  );
}

export default ChartItem;
