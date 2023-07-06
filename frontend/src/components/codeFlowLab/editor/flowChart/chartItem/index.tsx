import classNames from 'classnames/bind';
import styles from './chartItem.module.scss';
const cx = classNames.bind(styles);
//
import {
  BLOCK_HEADER_SIZE,
  CONNECT_POINT_GAP,
  CONNECT_POINT_SIZE,
  CONNECT_POINT_START,
  FLOW_CHART_ITEMS_STYLE,
  POINT_LIST_PADDING,
} from '@/consts/codeFlowLab/items';
import { ChartItems, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import _ from 'lodash';
import { MouseEventHandler, useCallback, useEffect, useMemo } from 'react';
import { getConnectSizeByType, getElType } from '../utils';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  itemInfo: ChartItems;
  isSelected: boolean;
  handleItemMoveStart: (_event: MouseEvent, _selectedItem: ChartItems) => void;
  handlePointConnectStart: MouseEventHandler<HTMLSpanElement>;
}
function ChartItem({ chartItems, itemInfo, isSelected, handleItemMoveStart, handlePointConnectStart }: Props) {
  const connectSizeByType = useMemo(
    () => getConnectSizeByType(itemInfo.connectionIds, chartItems),
    [chartItems, itemInfo]
  );

  const connectPointList = useMemo(() => {
    return Object.keys(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList).map((_x, _i) => {
      const typeGroup = _.groupBy(itemInfo.connectionIds[_x], (_id) => getElType(chartItems[_id].elType));

      return (
        <ul key={_i} className={cx('point-list', _x)}>
          {(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList[_x] || []).map((_type, _j) => {
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
                  <span className={cx('label', _x)} title={typeGroup[_type]?.[_k]}>{typeGroup[_type]?.[_k]}</span>
                  <span
                    onMouseDown={handlePointConnectStart}
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
  }, [connectSizeByType]);

  return (
    <div
      className={cx('chart-item', getElType(itemInfo.elType), { selected: isSelected })}
      data-id={itemInfo.id}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,

        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,

        zIndex: itemInfo.zIndex,
      }}
      onMouseDown={(_event) => handleItemMoveStart(_event.nativeEvent, itemInfo)}
    >
      <span
        className={cx('item-point')}
        style={{
          backgroundColor: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].backgroundColor,
        }}
      />
      <p
        className={cx('item-header')}
        style={{
          height: BLOCK_HEADER_SIZE,
        }}
      >
        {itemInfo.id}
      </p>
      <div
        className={cx('point-list-wrap')}
        style={{
          minHeight:
            Math.max(
              (itemInfo.connectionIds?.right || []).length,
              Math.max((itemInfo.connectionIds?.left || []).length, 0)
            ) *
            (CONNECT_POINT_GAP + CONNECT_POINT_SIZE),
          paddingLeft: POINT_LIST_PADDING,
          paddingRight: POINT_LIST_PADDING,
          paddingTop: CONNECT_POINT_START,
        }}
      >
        {connectPointList}
      </div>
    </div>
  );
}

export default ChartItem;
