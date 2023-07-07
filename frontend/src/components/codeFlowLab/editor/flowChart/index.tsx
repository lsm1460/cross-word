import classNames from 'classnames/bind';
import styles from './flowChart.module.scss';
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
import { ChartItems, PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getChartItem } from '@/src/utils/content';
import _ from 'lodash';
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ConnectPoints, MoveItems } from '..';
import ChartItem from './chartItem';
import { doPolygonsIntersect, getConnectSizeByType, getElType, getRectPoints } from './utils';

interface Props {
  moveItems: MoveItems;
  connectPoints: ConnectPoints;
  scale?: number;
  transX?: number;
  transY?: number;
}
function FlowChart({ scale, transX, transY, moveItems, connectPoints }: Props) {
  const flowChartRef = useRef<HTMLDivElement>(null);
  const chartItemWrapRef = useRef<HTMLDivElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectedCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectedItemId = useRef<string>(null);
  const multiSelectedIdListClone = useRef<string[]>([]);
  const totalDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const selectedConnectionPoint = useRef<PointPos>(null);
  const multiSelectBoxStartPos = useRef<[number, number]>(null);
  const multiSelectBoxEndPos = useRef<[number, number]>(null);

  const chartItems = useSelector((state: RootState) => getChartItem(state.mainDocument), shallowEqual);

  const [lineCanvasCtx, setLineCanvasCtx] = useState<CanvasRenderingContext2D>(null);
  const [connectedCanvasCtx, setConnectedCanvasCtx] = useState<CanvasRenderingContext2D>(null);
  const [multiSelectedItemList, setMultiSelectedItemList] = useState<{ [_itemId: string]: { x: number; y: number } }>(
    {}
  );
  const [itemMoveDelta, setItemMoveDelta] = useState({ x: 0, y: 0 });

  const orderedChartItems = useMemo(() => {
    const selectedIdList = selectedItemId.current ? Object.keys(multiSelectedItemList) : [];
    const adjustedMovePosItems = _.mapValues(chartItems, (_v, _kId) => {
      if (selectedIdList.includes(_kId)) {
        return {
          ..._v,
          pos: {
            ..._v.pos,
            left: multiSelectedItemList[_kId].x,
            top: multiSelectedItemList[_kId].y,
          },
        };
      } else {
        return _v;
      }
    });

    return Object.values(adjustedMovePosItems).sort((_before, _after) => _after.zIndex - _before.zIndex);
  }, [chartItems, scale, multiSelectedItemList, selectedItemId]);

  const chartItemConnectPointsByDir: {
    [x: string]: { left?: PointPos[]; right?: PointPos[]; connectionIds: { left?: string[]; right?: string[] } };
  } = useMemo(() => {
    const items = _.mapKeys(orderedChartItems, (_item) => _item.id);

    return _.mapValues(items, (_item) => ({
      connectionIds: _item.connectionIds,
      ..._.mapValues(_item.connectionIds, (_ids: string, _dir) => {
        const connectSizeByType = getConnectSizeByType(_item.connectionIds, chartItems);
        const connectSizeByDir = _.mapValues(connectSizeByType, (_sizeByType) =>
          _.reduce(
            _sizeByType,
            (_acc, _cur) => {
              return _acc + _cur;
            },
            0
          )
        );

        let _i = -1;

        return (FLOW_CHART_ITEMS_STYLE[_item.elType].connectionTypeList[_dir] || [])
          .map((_type, _j, _jj) => {
            const dirSize = _jj.length + connectSizeByDir[_dir];

            return Array((connectSizeByType[_dir][_type] || 0) + 1)
              .fill(undefined)
              .map((__, _k, _kk) => {
                _i++;

                const itemHeight =
                  FLOW_CHART_ITEMS_STYLE[_item.elType].height +
                  Math.max(
                    (_item.connectionIds?.right || []).length,
                    Math.max((_item.connectionIds?.left || []).length, 0)
                  ) *
                    (CONNECT_POINT_GAP + CONNECT_POINT_SIZE);

                return {
                  id: _item.id,
                  left: _item.pos.left + (_dir === 'left' ? 0 : FLOW_CHART_ITEMS_STYLE[_item.elType].width),
                  top:
                    _item.pos.top +
                    BLOCK_HEADER_SIZE +
                    CONNECT_POINT_START +
                    _i * (CONNECT_POINT_SIZE + CONNECT_POINT_GAP),
                  index: _i,
                  connectType: _dir as 'right' | 'left',
                  connectElType: _type,
                  connectionIds: _item.connectionIds?.[_dir] || [],
                };
              });
          })
          .flat();
      }),
    }));
  }, [orderedChartItems]);

  const chartItemConnectPoints: { [x: string]: PointPos[] } = useMemo(
    () =>
      _.mapValues(chartItemConnectPointsByDir, (_item) =>
        Object.values({ left: _item?.['left'] || [], right: _item?.['right'] || [] }).flat()
      ),
    [chartItemConnectPointsByDir]
  );

  const connectedPointList = useMemo(() => {
    const findItemIndex = (_key, _id, _dir) => {
      let typeGroup = _.mapKeys(FLOW_CHART_ITEMS_STYLE[chartItems[_id].elType].connectionTypeList[_dir]);
      typeGroup = _.mapValues(typeGroup, (__, _typeKey) =>
        chartItemConnectPointsByDir[_id].connectionIds[_dir].filter(
          (_typeId) => getElType(chartItems[_typeId].elType) === _typeKey
        )
      );

      let keyIndex = 0;

      for (let _typeKey in typeGroup) {
        if (typeGroup[_typeKey].indexOf(_key) > -1) {
          keyIndex += typeGroup[_typeKey].indexOf(_key);
          break;
        } else {
          keyIndex += typeGroup[_typeKey].length + 1;
        }
      }

      return keyIndex;
    };

    const result = [];
    const idCheckList = [];

    Object.keys(chartItemConnectPointsByDir).forEach((_key) => {
      const _items = chartItemConnectPointsByDir[_key];

      for (let _dir in _items.connectionIds) {
        const _idList = _items.connectionIds[_dir as 'right' | 'left'];

        _idList.forEach((_id) => {
          // _id 출발
          // _key 도착
          const startIndex = findItemIndex(_id, _key, _dir);

          const startPoint = _items[_dir as 'right' | 'left'][startIndex];
          const invertedDir = _dir === 'right' ? 'left' : 'right';

          const connectedIndex = findItemIndex(_key, _id, invertedDir);

          const connectedPoint = chartItemConnectPointsByDir[_id][invertedDir][connectedIndex];

          const checkId = [startPoint.id, connectedPoint.id].sort().join('-');

          if (!idCheckList.includes(checkId)) {
            idCheckList.push(checkId);

            result.push([startPoint, connectedPoint]);
          }
        });
      }
    });

    return result;
  }, [chartItemConnectPointsByDir]);

  useEffect(() => {
    if (lineCanvasRef.current && connectedCanvasRef.current) {
      const lineCanvas = lineCanvasRef.current;
      const connectedCanvas = connectedCanvasRef.current;

      lineCanvas.width = lineCanvas.parentElement.clientWidth;
      lineCanvas.height = lineCanvas.parentElement.clientHeight;
      connectedCanvas.width = connectedCanvas.parentElement.clientWidth;
      connectedCanvas.height = connectedCanvas.parentElement.clientHeight;
    }
  }, [lineCanvasRef, connectedCanvasRef, scale]);

  useEffect(() => {
    if (lineCanvasRef.current && connectedCanvasRef.current) {
      const lineCanvas = lineCanvasRef.current;
      const connectedCanvas = connectedCanvasRef.current;

      const lineCtx = lineCanvas.getContext('2d');
      const connectedCtx = connectedCanvas.getContext('2d');

      setLineCanvasCtx(lineCtx);
      setConnectedCanvasCtx(connectedCtx);
    }
  }, [lineCanvasRef, connectedCanvasRef]);

  useEffect(() => {
    if (connectedCanvasCtx) {
      connectedCanvasCtx.clearRect(0, 0, connectedCanvasRef.current.width, connectedCanvasRef.current.height);

      connectedPointList.forEach((_points) => {
        drawConnectionPointLine(connectedCanvasCtx, _points[0], _points[1]);
      });
    }
  }, [connectedCanvasCtx, connectedPointList, transX, transY]);

  useEffect(() => {
    multiSelectedIdListClone.current = Object.keys(multiSelectedItemList);
  }, [multiSelectedItemList]);

  useEffect(() => {
    if (selectedItemId.current) {
      totalDelta.current = {
        x: totalDelta.current.x + itemMoveDelta.x,
        y: totalDelta.current.y + itemMoveDelta.y,
      };

      setMultiSelectedItemList((_prev) =>
        _.mapValues(_prev, (_pos) => ({ x: _pos.x + itemMoveDelta.x, y: _pos.y + itemMoveDelta.y }))
      );
    }
  }, [itemMoveDelta, selectedItemId]);

  const convertClientPosToLocalPos = (_clientPos: { x: number; y: number }) => {
    const { left, top } = flowChartRef.current.getBoundingClientRect();

    return { x: (_clientPos.x - left) / scale, y: (_clientPos.y - top) / scale };
  };

  const drawConnectionPointLine = (_ctx: CanvasRenderingContext2D, _origin: PointPos, _next?: PointPos) => {
    const GAP = 20;

    _ctx.beginPath();
    _ctx.moveTo(_origin.left + transX, _origin.top + transY);

    if (_next && _next.id !== _origin.id) {
      let horDir: 'right' | 'left' = null;

      if (_next.left - _origin.left > 0) {
        // right
        horDir = 'right';
      } else if (_next.left - _origin.left < 0) {
        // left
        horDir = 'left';
      } else {
        // fixed x
      }

      if (_origin.connectType === 'right' && horDir === 'right' && _next.connectType === 'right') {
        _ctx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _origin.top);
        _ctx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _next.top);
      } else if (
        (_origin.connectType === 'right' && horDir === 'right' && _next.connectType === 'left') ||
        (_origin.connectType === 'left' && horDir === 'left' && _next.connectType === 'right')
      ) {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(leftPos + Math.max((rightPos - leftPos) / 2, 0) + transX, _origin.top + transY);
        _ctx.lineTo(leftPos + Math.max((rightPos - leftPos) / 2, 0) + transX, _next.top + transY);
      } else if (_origin.connectType === 'right' && horDir === 'left' && _next.connectType === 'left') {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(rightPos + GAP, _origin.top);
        _ctx.lineTo(rightPos + GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(leftPos - GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(leftPos - GAP, _next.top);
      } else if (_origin.connectType === 'left' && horDir === 'right' && _next.connectType === 'right') {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(leftPos - GAP + transX, _origin.top + transY);
        _ctx.lineTo(leftPos - GAP + transX, Math.max((_next.top + _origin.top) / 2, 0) + transY);
        _ctx.lineTo(rightPos + GAP + transX, Math.max((_next.top + _origin.top) / 2, 0) + transY);
        _ctx.lineTo(rightPos + GAP + transX, _next.top + transY);
      }
      _ctx.lineTo(_next.left + transX, _next.top + transY);
    } else {
      _ctx.lineTo(selectedConnectionPoint.current.left + transX, selectedConnectionPoint.current.top + transY);
    }

    _ctx.strokeStyle = '#ff0000';
    _ctx.stroke();
  };

  const getConnectPoint = (_x: number, _y: number, _connectType?: 'left' | 'right', _id?: string): PointPos => {
    let _elType;

    if (_id) {
      _elType = getElType(chartItems[_id].elType);
    }

    const _points = Object.values(chartItemConnectPoints)
      .flat()
      .filter((_pos) => {
        let connectionTypeList = [];

        if (_connectType) {
          const _invertedConnectType = _connectType === 'left' ? 'right' : 'left';

          if (_invertedConnectType === _pos.connectType) {
            connectionTypeList =
              FLOW_CHART_ITEMS_STYLE[chartItems[_pos.id].elType].connectionTypeList?.[_invertedConnectType] || [];
          }
        }

        return (
          (_id ? connectionTypeList.includes(_elType) : true) &&
          (_id ? !_pos.connectionIds.includes(_id) : true) &&
          _pos.left - CONNECT_POINT_SIZE - POINT_LIST_PADDING + transX <= _x &&
          _x <= CONNECT_POINT_SIZE + _pos.left + POINT_LIST_PADDING + transX &&
          _pos.top - CONNECT_POINT_SIZE / 2 + transY <= _y &&
          _y <= CONNECT_POINT_SIZE + _pos.top + transY
        );
      });

    return _.reduce(
      _points,
      (_acc, _cur) => {
        if ((_acc?.zIndex || 0) < chartItems[_cur.id].zIndex) {
          // _acc보다 z-index가 크다면
          return _cur;
        } else {
          // _acc보다 z-index가 작다면
          return _acc;
        }
      },
      null
    );
  };

  const getItemIdByPos = (_x: number, _y: number) => {
    // todo: item grap area를 ui상에서 고려해보자
    const _filtered = orderedChartItems.filter(
      (_item) =>
        _item.pos.left + transX <= _x &&
        _x <= FLOW_CHART_ITEMS_STYLE[_item.elType].width + _item.pos.left + transX &&
        _item.pos.top + transY <= _y &&
        _y <= FLOW_CHART_ITEMS_STYLE[_item.elType].height + _item.pos.top + transY
    );

    return _filtered[_filtered.length - 1];
  };

  const getSelectedItemIds = () => {
    let _idList = [];

    if (chartItemWrapRef.current && multiSelectBoxStartPos.current && multiSelectBoxEndPos.current) {
      const children = Array.from(chartItemWrapRef.current.children);

      const selectBox = [
        { x: multiSelectBoxStartPos.current[0], y: multiSelectBoxStartPos.current[1] },
        { x: multiSelectBoxEndPos.current[0], y: multiSelectBoxStartPos.current[1] },
        { x: multiSelectBoxEndPos.current[0], y: multiSelectBoxEndPos.current[1] },
        { x: multiSelectBoxStartPos.current[0], y: multiSelectBoxEndPos.current[1] },
      ];

      children.forEach((_el) => {
        const _htmlEl = _el as HTMLElement;
        let points = getRectPoints(_htmlEl);
        points = points.map((_point) => convertClientPosToLocalPos(_point));

        const isOverlap = doPolygonsIntersect(points, selectBox);

        if (isOverlap) {
          _idList.push(_htmlEl.dataset.id);
        }
      });
    }

    return _idList;
  };

  const handleItemMoveStart = useCallback((_event: MouseEvent, _selectedItem: ChartItems) => {
    _event.stopPropagation();

    // TODO: z-index조정
    if (multiSelectedIdListClone.current.includes(_selectedItem.id)) {
      if (_event.ctrlKey) {
        // 다중 선택이 있을 때 컨트롤 키가 눌러져 있다면 그 아이템을 선택취소한다.
        setMultiSelectedItemList((_prev) => {
          return _.pickBy(_prev, (_v, _itemId) => _itemId !== _selectedItem.id);
        });
      } else {
        // 다중 선택일 때 컨트롤 키가 눌러져 있지 않다면 그 아이템을 기준으로 움직인다.
        selectedItemId.current = _selectedItem.id;
      }
    } else {
      // 다중 선택된 아이템이 없을 때

      setMultiSelectedItemList((_prev) => {
        if (_event.ctrlKey) {
          // 컨트롤이 눌러져 있다면 아이템 추가
          return {
            ..._prev,
            [_selectedItem.id]: { x: _selectedItem.pos.left, y: _selectedItem.pos.top },
          };
        } else {
          // 다중 선택된 아이템이 없고 컨트롤도 없다면 하나의 아이템 추가
          return { [_selectedItem.id]: { x: _selectedItem.pos.left, y: _selectedItem.pos.top } };
        }
      });

      // 선택된 아이템을 기준으로 움직인다.
      selectedItemId.current = _selectedItem.id;
    }

    document.addEventListener('mousemove', handleMouseMoveItems);
    document.addEventListener('mouseup', handleMouseUpItems);
  }, []);

  const handlePointConnectStart: MouseEventHandler<HTMLSpanElement> = useCallback(
    (_event) => {
      _event.stopPropagation();

      selectedItemId.current = null;
      setMultiSelectedItemList({});

      const { x: convertedX, y: convertedY } = convertClientPosToLocalPos({ x: _event.clientX, y: _event.clientY });

      const selectedPoint = getConnectPoint(convertedX, convertedY);

      if (selectedPoint) {
        const _hasId = chartItems[selectedPoint.id].connectionIds[selectedPoint.connectType][selectedPoint.index];

        if (_hasId) {
          // 이미 연결된 포인트를 분리시켜야 함
        } else {
          selectedConnectionPoint.current = selectedPoint;

          document.addEventListener('mousemove', handleMouseMovePoint);
          document.addEventListener('mouseup', handleMouseUpPoint);
        }
      }
    },
    [lineCanvasCtx, chartItems]
  );

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (_event) => {
    if (_event.buttons === 1 && !selectedItemId.current && !selectedConnectionPoint.current) {
      // multi select.. only left click..

      const { x: convertedX, y: convertedY } = convertClientPosToLocalPos({ x: _event.clientX, y: _event.clientY });

      multiSelectBoxStartPos.current = [convertedX, convertedY];
      multiSelectBoxEndPos.current = [convertedX, convertedY];

      document.addEventListener('mousemove', handleMouseMoveMultiSelect);
      document.addEventListener('mouseup', handleMouseUpMultiSelect);

      return;
    }
  };

  const handleMouseMoveItems = (_event: MouseEvent) => {
    if (selectedItemId.current) {
      setItemMoveDelta({ x: _event.movementX / scale, y: _event.movementY / scale });
    }
  };

  const handleMouseMovePoint = (_event: MouseEvent) => {
    if (selectedConnectionPoint.current) {
      const _targetPoint = {
        ...selectedConnectionPoint.current,
        left: selectedConnectionPoint.current.left + _event.movementX / scale,
        top: selectedConnectionPoint.current.top + _event.movementY / scale,
      };

      selectedConnectionPoint.current = _targetPoint;

      lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);

      const originPoint = chartItemConnectPoints[_targetPoint.id].filter(
        (_p) => _p.connectType === _targetPoint.connectType
      )[_targetPoint.index];

      const _nextPoint = getConnectPoint(
        _targetPoint.left + transX,
        _targetPoint.top + transY,
        _targetPoint.connectType,
        _targetPoint.id
      );

      let connectedPoint;

      if (_nextPoint) {
        const originElType = getElType(chartItems[originPoint.id].elType);
        const nextElType = getElType(chartItems[_nextPoint.id].elType);

        if (_nextPoint.connectElType === originElType && originPoint.connectElType === nextElType) {
          connectedPoint = _nextPoint;
        }
      }

      drawConnectionPointLine(lineCanvasCtx, originPoint, connectedPoint);
    }
  };

  const getSelectItemPos = (_itemIdList) => {
    const _ids = _.mapKeys(_itemIdList, (_id) => _id);

    return _.mapValues(_ids, (__, _itemId) => ({ x: chartItems[_itemId].pos.left, y: chartItems[_itemId].pos.top }));
  };

  const handleMouseMoveMultiSelect = (_event: MouseEvent) => {
    if (multiSelectBoxStartPos) {
      lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);

      const _multiSelectEndPos = [
        multiSelectBoxEndPos.current[0] + _event.movementX / scale,
        multiSelectBoxEndPos.current[1] + _event.movementY / scale,
      ] as [number, number];

      multiSelectBoxEndPos.current = _multiSelectEndPos;

      const selectedIds = getSelectedItemIds();
      const selectedItemPos = getSelectItemPos(selectedIds);

      setMultiSelectedItemList(selectedItemPos);

      lineCanvasCtx.beginPath();

      lineCanvasCtx.fillStyle = 'red';
      lineCanvasCtx.globalAlpha = 0.2;

      const _endPos = _multiSelectEndPos.map((_p, _i) => _p - multiSelectBoxStartPos.current[_i]) as [number, number];

      lineCanvasCtx.fillRect(...multiSelectBoxStartPos.current, ..._endPos);
    }
  };

  const handleMouseUpItems = () => {
    moveItems(multiSelectedIdListClone.current, totalDelta.current.x, totalDelta.current.y);

    // 관련 값 초기화
    selectedItemId.current = null;
    totalDelta.current = { x: 0, y: 0 };
    multiSelectedIdListClone.current = [];

    document.removeEventListener('mousemove', handleMouseMoveItems);
    document.removeEventListener('mouseup', handleMouseUpItems);
  };

  const handleMouseUpPoint = () => {
    lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);

    document.removeEventListener('mousemove', handleMouseMovePoint);
    document.removeEventListener('mouseup', handleMouseUpPoint);

    if (selectedConnectionPoint.current) {
      const _connected = getConnectPoint(
        selectedConnectionPoint.current.left + transX,
        selectedConnectionPoint.current.top + transY,
        selectedConnectionPoint.current.connectType,
        selectedConnectionPoint.current.id
      );

      _connected && connectPoints(selectedConnectionPoint.current, _connected);
      selectedConnectionPoint.current = null;
    }
  };

  const handleMouseUpMultiSelect = (_event: MouseEvent) => {
    lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);
    const selectedIds = getSelectedItemIds();
    const selectedItemPos = getSelectItemPos(selectedIds);

    setMultiSelectedItemList(selectedItemPos);

    multiSelectBoxStartPos.current = null;
    multiSelectBoxEndPos.current = null;

    document.removeEventListener('mousemove', handleMouseMoveMultiSelect);
    document.removeEventListener('mouseup', handleMouseUpMultiSelect);
  };

  return (
    <div
      ref={flowChartRef}
      className={cx('canvas-wrap')}
      onMouseDown={handleMouseDown}
      style={{
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
        left: `calc(50% - ${transX}px)`,
        top: `calc(50% - ${transY}px)`,
      }}
    >
      <canvas ref={connectedCanvasRef} className={cx('connection-flow-chart')} />

      <div
        ref={chartItemWrapRef}
        style={{
          left: transX,
          top: transY,
        }}
      >
        {orderedChartItems.map((_itemInfo) => (
          <ChartItem
            key={_itemInfo.id}
            chartItems={chartItems}
            itemInfo={_itemInfo}
            isSelected={Object.keys(multiSelectedItemList).includes(_itemInfo.id)}
            handleItemMoveStart={handleItemMoveStart}
            handlePointConnectStart={handlePointConnectStart}
          />
        ))}
      </div>

      <canvas ref={lineCanvasRef} className={cx('connection-flow-chart', 'layer-top')} />
    </div>
  );
}

export default FlowChart;
