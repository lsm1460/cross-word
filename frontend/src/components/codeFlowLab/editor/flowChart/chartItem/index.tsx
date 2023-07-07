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
import { KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { getConnectSizeByType, getElType } from '../utils';
import { useDebounceSubmitText } from '@/src/utils/content';
import { useDispatch } from 'react-redux';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  itemInfo: ChartItems;
  isSelected: boolean;
  handleItemMoveStart: (_event: MouseEvent, _selectedItem: ChartItems) => void;
  handlePointConnectStart: MouseEventHandler<HTMLSpanElement>;
}
function ChartItem({ chartItems, itemInfo, isSelected, handleItemMoveStart, handlePointConnectStart }: Props) {
  const dispatch = useDispatch();
  const [debounceSubmitText] = useDebounceSubmitText(`items.${itemInfo.id}.name`);

  const connectSizeByType = useMemo(
    () => getConnectSizeByType(itemInfo.connectionIds, chartItems),
    [chartItems, itemInfo]
  );

  const [itemName, setItemName] = useState(itemInfo.name);
  const [isTyping, setIsTyping] = useState(false);

  const selectName = (_isTyping, _originText, _insertedText) => {
    if (_isTyping) {
      return _insertedText;
    }

    return _originText;
  };

  const selectedName = useMemo(() => selectName(isTyping, itemInfo.name, itemName), [isTyping, itemInfo, itemName]);

  const connectPointList = useMemo(() => {
    return Object.keys(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList).map((_x, _i) => {
      const typeGroup = _.groupBy(itemInfo.connectionIds[_x], (_id) => getElType(chartItems[_id].elType));

      return (
        <ul key={_i} className={cx('point-list', _x)}>
          {(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList[_x] || []).map((_type, _j) => {
            return Array((connectSizeByType[_x][_type] || 0) + 1)
              .fill(undefined)
              .map((__, _k) => {
                const _itemId = typeGroup[_type]?.[_k];
                const _itemName = _itemId ? chartItems[_itemId].name : '';

                return (
                  <li
                    key={`${_i}-${_j}-${_k}`}
                    style={{
                      height: 0,
                      marginTop: CONNECT_POINT_GAP + CONNECT_POINT_SIZE,
                    }}
                  >
                    <span className={cx('label', _x)} title={_itemName}>
                      {_itemName}
                    </span>
                    <span
                      onMouseDown={handlePointConnectStart}
                      className={cx('dot', `${getElType(itemInfo.elType)}-${_type}`)}
                      style={{
                        width: CONNECT_POINT_SIZE,
                        height: CONNECT_POINT_SIZE,
                      }}
                    />
                  </li>
                );
              });
          })}
        </ul>
      );
    });
  }, [connectSizeByType]);

  const handleCancelInsert: KeyboardEventHandler<HTMLInputElement> = (_event) => {
    if (_event.code === 'Escape') {
      console.log('itemInfo.name', itemInfo.name);
      debounceSubmitText.cancel();

      setIsTyping(false);

      setItemName(itemInfo.name);

      setTimeout(() => {
        (_event.target as HTMLInputElement).blur();
      }, 50);
    }
  };

  const handleTitleInput = (_event) => {
    setIsTyping(true);

    setItemName(_event.target.value);

    console.log('submit 1');
    debounceSubmitText(_event.target.value);
  };

  const emitText = (_text) => {
    debounceSubmitText.cancel();

    if (_text !== itemInfo.name) {
      console.log('submit 2');
      dispatch(
        setDocumentValueAction({
          key: `items.${itemInfo.id}.name`,
          value: _text,
        })
      );
    }
  };

  const handleDeleteItem: MouseEventHandler<HTMLButtonElement> = (_event) => {
    _event.stopPropagation();

    alert('delete..');
  };

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
      <button className={cx('delete-button')} onClick={handleDeleteItem}>
        <i className="material-symbols-outlined">close</i>
      </button>
      <span
        className={cx('item-point')}
        style={{
          backgroundColor: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].backgroundColor,
        }}
      />

      <input
        type="text"
        className={cx('item-header')}
        style={{
          height: BLOCK_HEADER_SIZE,
        }}
        onKeyDown={handleCancelInsert}
        onChange={handleTitleInput}
        onBlur={(_event) => {
          setIsTyping(false);

          emitText(_event.target.value);
        }}
        value={selectedName}
        maxLength={15}
      />

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
