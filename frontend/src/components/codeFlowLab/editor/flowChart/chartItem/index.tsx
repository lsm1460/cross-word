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
import { ChartItemType, ChartItems, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getSceneId, useDebounceSubmitText } from '@/src/utils/content';
import _ from 'lodash';
import {
  KeyboardEventHandler,
  MouseEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getConnectSizeByType, getElType } from '../utils';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  itemInfo: ChartItems;
  isSelected: boolean;
  handleItemMoveStart: (_event: MouseEvent, _selectedItem: ChartItems) => void;
  handlePointConnectStart: MouseEventHandler<HTMLSpanElement>;
}
function ChartItem({ chartItems, itemInfo, isSelected, handleItemMoveStart, handlePointConnectStart }: Props, ref) {
  const dispatch = useDispatch();
  const [debounceSubmitText] = useDebounceSubmitText(`items.${itemInfo.id}.name`);

  const { selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const connectSizeByType = useMemo(
    () => getConnectSizeByType(itemInfo.connectionIds, chartItems),
    [chartItems, itemInfo]
  );

  const [itemName, setItemName] = useState(itemInfo.name);
  const [isTyping, setIsTyping] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [multiDeleteDelay, setMultiDeleteDelay] = useState(0);

  useEffect(() => {
    if (onDelete) {
      setTimeout(() => {
        const ops = [];
        let newChartItems = _.pickBy(chartItems, (_item) => _item.id !== itemInfo.id);
        newChartItems = _.mapValues(newChartItems, (_item) => ({
          ..._item,
          connectionIds: {
            ..._item.connectionIds,
            left: [...(_item.connectionIds?.left || []).filter((_id) => _id !== itemInfo.id)],
            right: [...(_item.connectionIds?.right || []).filter((_id) => _id !== itemInfo.id)],
          },
        }));
        ops.push({
          key: 'items',
          value: newChartItems,
        });
        ops.push({
          key: `scene.${selectedSceneId}.itemIds`,
          value: sceneItemIds.filter((_id) => _id !== itemInfo.id),
        });
        dispatch(setDocumentValueAction(ops));
      }, 200);
    }
  }, [onDelete, chartItems, selectedSceneId, sceneItemIds]);

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

    setOnDelete(true);
  };

  useImperativeHandle(ref, () => ({
    setMultiDeleteDelay,
  }));

  return (
    <div
      className={cx('chart-item', getElType(itemInfo.elType), {
        selected: isSelected,
        delete: onDelete || multiDeleteDelay > 0,
      })}
      data-id={itemInfo.id}
      style={{
        left: itemInfo.pos.left,
        top: itemInfo.pos.top,

        minWidth: FLOW_CHART_ITEMS_STYLE[itemInfo.elType].width,

        zIndex: itemInfo.zIndex,
        transitionDelay: `${multiDeleteDelay || 100}ms`,
      }}
      onMouseDown={(_event) => handleItemMoveStart(_event.nativeEvent, itemInfo)}
    >
      {itemInfo.elType !== ChartItemType.body && (
        <button className={cx('delete-button')} onClick={handleDeleteItem}>
          <i className="material-symbols-outlined">close</i>
        </button>
      )}

      <div className={cx('item-header', getElType(itemInfo.elType))}>
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
    </div>
  );
}

type Ref = {
  deleteItem: (_ids: string[]) => void;
} | null;

export default forwardRef<Ref, Props>(ChartItem);
