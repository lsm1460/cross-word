import classNames from 'classnames/bind';
import styles from './chartItem.module.scss';
const cx = classNames.bind(styles);
//
import {
  BLOCK_HEADER_SIZE,
  CHART_SCRIPT_ITEMS,
  CONNECT_POINT_CLASS,
  CONNECT_POINT_GAP,
  CONNECT_POINT_SIZE,
  CONNECT_POINT_START,
  FLOW_CHART_ITEMS_STYLE,
  POINT_LIST_PADDING,
} from '@/consts/codeFlowLab/items';
import { ChartItemType, ChartItems, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { setDeleteTargetIdListAction, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { useDebounceSubmitText } from '@/src/utils/content';
import _ from 'lodash';
import { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectSizeByType, getBlockType } from '../utils';
import PropertiesEditBlock from './propertiesEditBlock';

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

  const deleteTargetIdList = useSelector((state: RootState) => state.mainDocument.deleteTargetIdList);

  const checkDeep = ![ChartItemType.function].includes(itemInfo.elType);

  const connectSizeByType = useMemo(
    () => getConnectSizeByType(itemInfo.connectionIds, chartItems, checkDeep),
    [chartItems, itemInfo]
  );

  const [itemName, setItemName] = useState(itemInfo.name);
  const [isTyping, setIsTyping] = useState(false);
  const [multiDeleteDelay, setMultiDeleteDelay] = useState(-1);

  useEffect(() => {
    if (deleteTargetIdList.length > 0) {
      setMultiDeleteDelay(deleteTargetIdList.indexOf(itemInfo.id) * 100);
    }
  }, [deleteTargetIdList]);

  const selectName = (_isTyping, _originText, _insertedText) => {
    if (_isTyping) {
      return _insertedText;
    }

    return _originText;
  };

  const selectedName = useMemo(() => selectName(isTyping, itemInfo.name, itemName), [isTyping, itemInfo, itemName]);
  const connectPointList = useMemo(() => {
    return Object.keys(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList).map((_x, _i) => {
      const typeGroup = _.groupBy(itemInfo.connectionIds[_x], (_point) => {
        // 일반적으로는 그룹 별로 묶지만, 변수의 경우 다양한 블록들과 그룹지어 연결하지 않기 때문에 분기처리 추가
        if (itemInfo.elType === ChartItemType.variable) {
          return ChartItemType.variable;
        }

        return getBlockType(chartItems[_point.connectParentId]?.elType, checkDeep ? _x === 'right' : _x !== 'right');
      });

      return (
        <ul key={_i} className={cx('point-list', _x)}>
          {(FLOW_CHART_ITEMS_STYLE[itemInfo.elType].connectionTypeList[_x] || []).map((_type, _j) => {
            let _pointSize = connectSizeByType[_x][_type] || 0;

            // 일반적으로는 그룹 별로 묶인 수 + 1로 연결점의 수 정의되지만, 변수의 경우 다양한 블록들과 그룹지어 연결하지 않기 때문에 분기처리 추가
            if (itemInfo.elType === ChartItemType.variable) {
              _pointSize = (Object.values(connectSizeByType[_x]) as number[]).reduce((_acc, _cur) => _acc + _cur, 0);
            }

            return Array(_pointSize + 1)
              .fill(undefined)
              .map((__, _k) => {
                const _point = typeGroup[_type]?.[_k];
                const _itemName = _point ? chartItems[_point.connectParentId].name : '';

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
                      className={cx('dot', `${getBlockType(itemInfo.elType, true)}-${_type}`, {
                        [CONNECT_POINT_CLASS]: true,
                      })}
                      id={`${itemInfo.id}-dot-${_x}-${_j}-${_k}`}
                      data-connect-dir={_x}
                      data-parent-id={itemInfo.id}
                      data-index={_j}
                      data-type-index={_k}
                      data-connect-type={_type}
                      {...(_point && {
                        'data-connect-id': _point.connectId,
                      })}
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
      debounceSubmitText.cancel();

      setIsTyping(false);

      setItemName(itemInfo.name);

      setTimeout(() => {
        (_event.target as HTMLInputElement).blur();
      }, 50);
    }
  };

  const handleTitleInput = (_event) => {
    if (_event.target.value.length < 1) {
      alert('최소 한 글자 이상 입력해주세요.');
      return;
    }

    setIsTyping(true);

    setItemName(_event.target.value);

    debounceSubmitText(_event.target.value);
  };

  const emitText = (_text) => {
    debounceSubmitText.cancel();

    if (_text !== itemInfo.name) {
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

    if (itemInfo.elType === ChartItemType.body) {
      return;
    }

    dispatch(setDeleteTargetIdListAction([itemInfo.id]));
  };

  return (
    <div
      className={cx('chart-item', getBlockType(itemInfo.elType, true), {
        selected: isSelected,
        delete: multiDeleteDelay > -1,
      })}
      data-id={itemInfo.id}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,

        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,

        zIndex: itemInfo.zIndex,
        transitionDelay: `${multiDeleteDelay || 100}ms`,
      }}
    >
      {itemInfo.elType !== ChartItemType.body && (
        <button className={cx('delete-button')} onClick={handleDeleteItem}>
          <i className="material-symbols-outlined">close</i>
        </button>
      )}

      <div className={cx('item-header', getBlockType(itemInfo.elType, true))}>
        <div
          className={cx('drag-handle')}
          style={{ height: BLOCK_HEADER_SIZE }}
          onMouseDown={(_event) => handleItemMoveStart(_event.nativeEvent, itemInfo)}
        >
          <i className="material-symbols-outlined">drag_indicator</i>
        </div>

        <input
          type="text"
          readOnly={!isSelected}
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
      </div>

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

      <PropertiesEditBlock chartItem={itemInfo} handlePointConnectStart={handlePointConnectStart} />
    </div>
  );
}

export default ChartItem;
