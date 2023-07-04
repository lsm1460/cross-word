import classNames from 'classnames/bind';
import styles from './chartItem.module.scss';
const cx = classNames.bind(styles);
//
import {
  CHART_ELEMENT_ITEMS,
  CONNECT_POINT_GAP,
  CONNECT_POINT_SIZE,
  CONNECT_POINT_START,
  FLOW_CHART_ITEMS_STYLE,
} from '@/consts/codeFlowLab/items';
import { ChartItemType, ChartItems, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { useMemo } from 'react';
import { getConnectSizeByType, getElType } from '../utils';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  itemInfo: ChartItems;
  isSelected: boolean;
}
function ChartItem({ chartItems, itemInfo, isSelected }: Props) {
  const connectSizeByType = useMemo(
    () => getConnectSizeByType(itemInfo.connectionIds, chartItems),
    [chartItems, itemInfo]
  );

  const connectPointList = () => {
    return FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectorPosition.map(([_x, _y], _i) => {
      return (
        <ul
          key={_i}
          style={{
            [_y]: CONNECT_POINT_START,
            [_x]: 0,
            transform: _x === 'right' ? 'translateX(50%)' : 'translateX(-50%)',
          }}
        >
          {(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList[_x] || []).map((_type, _j) => {
            // console.log(connectSizeByType[_x][_type]);
            return Array((connectSizeByType[_x][_type] || 0) + 1)
              .fill(undefined)
              .map((__, _k) => (
                <li
                  key={`${_i}-${_j}-${_k}`}
                  style={{
                    height: 0,
                    marginTop: CONNECT_POINT_GAP + CONNECT_POINT_SIZE,
                  }}
                >
                  <span
                    className={cx('dot', `${getElType(itemInfo.elType)}-${_type}`)}
                    style={{
                      width: CONNECT_POINT_SIZE,
                      height: CONNECT_POINT_SIZE,
                    }}
                  />
                </li>
              ));
          })}
        </ul>
      );
    });
  };

  // console.log('connectPointList',connectPointList)

  return (
    <div
      className={cx('chart-item', { selected: isSelected })}
      data-id={itemInfo.id}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,
        backgroundColor: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].backgroundColor,
        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,
        minHeight:
          FLOW_CHART_ITEMS_STYLE[itemInfo.elType].height +
          Math.max(
            (itemInfo.connectionIds?.right || []).length,
            Math.max((itemInfo.connectionIds?.left || []).length, 0)
          ) *
            (CONNECT_POINT_GAP + CONNECT_POINT_SIZE),
        zIndex: itemInfo.zIndex,
      }}
    >
      <p>{itemInfo.id}</p>
      {connectPointList()}
    </div>
  );
}

export default ChartItem;
