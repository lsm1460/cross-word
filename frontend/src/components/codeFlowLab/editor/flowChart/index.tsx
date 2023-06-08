import classNames from 'classnames/bind';
import styles from './flowChart.module.scss';
const cx = classNames.bind(styles);
//
import {
  CONNECT_POINT_GAP,
  CONNECT_POINT_SIZE,
  CONNECT_POINT_START,
  FLOW_CHART_ITEMS_STYLE,
} from '@/consts/codeFlowLab/items';
import { CodeFlowChartDoc, PointPos } from '@/consts/types/codeFlowLab';
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { ConnectPoints, MoveItems } from '..';
import ChartItem from './chartItem';
import _ from 'lodash';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  moveItems: MoveItems;
  connectPoints: ConnectPoints;
}
function FlowChart({ chartItems, moveItems, connectPoints }: Props) {
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectedCanvasRef = useRef<HTMLCanvasElement>(null);

  const [lineCanvasCtx, setLineCanvasCtx] = useState<CanvasRenderingContext2D>(null);
  const [connectedCanvasCtx, setConnectedCanvasCtx] = useState<CanvasRenderingContext2D>(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedConnectionPoint, setSelectedConnectionPoint] = useState<PointPos>(null);

  const orderedChartItems = useMemo(
    () => Object.values(chartItems).sort((_before, _after) => _after.zIndex - _before.zIndex),
    [chartItems]
  );

  const chartItemConnectPoints: { [x: string]: PointPos[] } = useMemo(() => {
    const items = _.mapKeys(orderedChartItems, (_item) => _item.id);

    return _.mapValues(items, (_item) =>
      FLOW_CHART_ITEMS_STYLE[_item.elType].connectorPosition
        .map(([_x, _y]) => {
          return Array(_item.connectionIds[_x].length + 1)
            .fill(undefined)
            .map((__, j) => ({
              id: _item.id,
              left: _item.pos.left + (_x === 'left' ? 0 : FLOW_CHART_ITEMS_STYLE[_item.elType].width),
              top:
                _y === 'bottom'
                  ? _item.pos.top +
                    FLOW_CHART_ITEMS_STYLE[_item.elType].height -
                    CONNECT_POINT_START -
                    j * (CONNECT_POINT_SIZE + CONNECT_POINT_GAP)
                  : _item.pos.top + CONNECT_POINT_START + j * (CONNECT_POINT_SIZE + CONNECT_POINT_GAP),
              index: j,
              connectType: _x as 'right' | 'left',
              connectionIds: _item.connectionIds?.[_x] || [],
            }));
        })
        .flat()
    );
  }, [orderedChartItems]);

  const connectedPointList: PointPos[][] = useMemo(() => {
    const _points = Object.values(chartItemConnectPoints).flat();
    const connectedPointList = [];
    let connectedPoints = {}; // 이미 연결된 노드 검증용 빈 객체

    while (_points.length > 0) {
      connectedPoints = {
        ...connectedPoints,
        [_points[0].id]: [...(connectedPoints?.[_points[0].id] || [])],
      };

      const _invertedConnectType = _points[0].connectType === 'left' ? 'right' : 'left';

      const connectedPointIndex = _.findIndex(
        _points,
        (_p) =>
          _p.connectType === _invertedConnectType &&
          _points[0].connectionIds.includes(_p.id) &&
          !connectedPoints[_points[0].id].includes(_p.id)
      );

      if (connectedPointIndex < 0) {
        // 못찾음
        _points.shift();
      } else {
        // 찾음
        connectedPointList.push([_points[0], { ..._points[connectedPointIndex] }]);

        connectedPoints = {
          ...connectedPoints,
          [_points[0].id]: [...connectedPoints[_points[0].id], _points[connectedPointIndex].id],
        };

        _points.splice(connectedPointIndex, 1);
        _points.shift();
      }
    }

    return connectedPointList;
  }, [chartItemConnectPoints]);

  // console.log('chartItemConnectPoints', chartItemConnectPoints);

  useEffect(() => {
    if (lineCanvasRef.current && connectedCanvasRef.current) {
      const lineCanvas = lineCanvasRef.current;
      const connectedCanvas = connectedCanvasRef.current;

      lineCanvas.width = lineCanvas.parentElement.clientWidth;
      lineCanvas.height = lineCanvas.parentElement.clientHeight;
      connectedCanvas.width = connectedCanvas.parentElement.clientWidth;
      connectedCanvas.height = connectedCanvas.parentElement.clientHeight;

      const lineCtx = lineCanvas.getContext('2d');
      const connectedCtx = connectedCanvas.getContext('2d');

      setLineCanvasCtx(lineCtx);
      setConnectedCanvasCtx(connectedCtx);
    }
  }, [lineCanvasRef, connectedCanvasRef]);

  useEffect(() => {
    if (lineCanvasCtx) {
      lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);

      if (selectedConnectionPoint) {
        const originPoint = chartItemConnectPoints[selectedConnectionPoint.id].filter(
          (_p) => _p.connectType === selectedConnectionPoint.connectType
        )[selectedConnectionPoint.index];

        const _nextPoint = getConnectPoint(
          selectedConnectionPoint.left,
          selectedConnectionPoint.top,
          selectedConnectionPoint.connectType,
          selectedConnectionPoint.id
        );

        drawConnectionPointLine(lineCanvasCtx, originPoint, _nextPoint);
      }
    }
  }, [lineCanvasCtx, selectedConnectionPoint]);

  useEffect(() => {
    if (connectedCanvasCtx) {
      connectedCanvasCtx.clearRect(0, 0, connectedCanvasRef.current.width, connectedCanvasRef.current.height);

      connectedPointList.forEach((_points) => {
        drawConnectionPointLine(connectedCanvasCtx, _points[0], _points[1]);
      });
    }
  }, [connectedCanvasCtx, connectedPointList]);

  const drawConnectionPointLine = (_ctx: CanvasRenderingContext2D, _origin: PointPos, _next: PointPos) => {
    const GAP = 20;

    _ctx.beginPath();
    _ctx.moveTo(_origin.left, _origin.top);

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

      const originHorConnectPos = FLOW_CHART_ITEMS_STYLE[chartItems[_origin.id].elType].connectorPosition[0][0];
      const horConnectPos = FLOW_CHART_ITEMS_STYLE[chartItems[_next.id].elType].connectorPosition[0][0];

      if (originHorConnectPos === 'right' && horDir === 'right' && horConnectPos === 'right') {
        _ctx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _origin.top);
        _ctx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _next.top);
      } else if (
        (originHorConnectPos === 'right' && horDir === 'right' && horConnectPos === 'left') ||
        (originHorConnectPos === 'left' && horDir === 'left' && horConnectPos === 'right')
      ) {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(leftPos + Math.max((rightPos - leftPos) / 2, 0), _origin.top);
        _ctx.lineTo(leftPos + Math.max((rightPos - leftPos) / 2, 0), _next.top);
      } else if (originHorConnectPos === 'right' && horDir === 'left' && horConnectPos === 'left') {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(rightPos + GAP, _origin.top);
        _ctx.lineTo(rightPos + GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(leftPos - GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(leftPos - GAP, _next.top);
      } else if (originHorConnectPos === 'left' && horDir === 'right' && horConnectPos === 'right') {
        const rightPos = _next.left > _origin.left ? _next.left : _origin.left;
        const leftPos = _next.left <= _origin.left ? _next.left : _origin.left;

        _ctx.lineTo(leftPos - GAP, _origin.top);
        _ctx.lineTo(leftPos - GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(rightPos + GAP, Math.max((_next.top + _origin.top) / 2, 0));
        _ctx.lineTo(rightPos + GAP, _next.top);
      }
      _ctx.lineTo(_next.left, _next.top);
    } else {
      _ctx.lineTo(selectedConnectionPoint.left, selectedConnectionPoint.top);
    }

    _ctx.stroke();
  };

  const getConnectPoint = (_x: number, _y: number, _connectType?: 'left' | 'right', _id?: string): PointPos => {
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
          (_id ? connectionTypeList.includes(chartItems[_id].elType) : true) &&
          _pos.left - CONNECT_POINT_SIZE / 2 <= _x &&
          _x <= CONNECT_POINT_SIZE + _pos.left &&
          _pos.top - CONNECT_POINT_SIZE / 2 <= _y &&
          _y <= CONNECT_POINT_SIZE + _pos.top
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
    const _filtered = orderedChartItems.filter(
      (_item) =>
        _item.pos.left <= _x &&
        _x <= FLOW_CHART_ITEMS_STYLE[_item.elType].width + _item.pos.left &&
        _item.pos.top <= _y &&
        _y <= FLOW_CHART_ITEMS_STYLE[_item.elType].height + _item.pos.top
    );

    return _filtered[_filtered.length - 1];
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (_event) => {
    // TODO: consider zoom ...
    const selectedPoint = getConnectPoint(_event.clientX, _event.clientY);
    const selectedItem = getItemIdByPos(_event.clientX, _event.clientY);

    if (chartItems[selectedPoint?.id]?.zIndex >= (selectedItem?.zIndex || 0)) {
      setSelectedConnectionPoint(selectedPoint);
    } else if (selectedItem) {
      // select item..
      // TODO: z-index조정
      setSelectedItemIds([selectedItem.id]);
    } else {
      // multi select..
    }
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (_event) => {
    // TODO: consider zoom ...

    if (selectedItemIds.length > 0) {
      moveItems(selectedItemIds, _event.movementX, _event.movementY);
    }

    if (selectedConnectionPoint) {
      setSelectedConnectionPoint((_prev) => ({
        ..._prev,
        left: _prev.left + _event.movementX,
        top: _prev.top + _event.movementY,
      }));
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLDivElement> = (_event) => {
    setSelectedItemIds([]);

    if (selectedConnectionPoint) {
      const _connected = getConnectPoint(
        selectedConnectionPoint.left,
        selectedConnectionPoint.top,
        selectedConnectionPoint.connectType,
        selectedConnectionPoint.id
      );

      _connected && connectPoints(selectedConnectionPoint, _connected);
      setSelectedConnectionPoint(null);
    }
  };

  return (
    <div
      className={cx('canvas-wrap')}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={lineCanvasRef} className={cx('connection-flow-chart')} />
      <canvas ref={connectedCanvasRef} className={cx('connection-flow-chart')} />

      {orderedChartItems.map((_itemInfo) => (
        <ChartItem key={_itemInfo.id} itemInfo={_itemInfo} />
      ))}
    </div>
  );
}

export default FlowChart;
