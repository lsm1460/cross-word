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
      Array(_item.connectionIds.length + 1)
        .fill(undefined)
        .map((__, i) => ({
          id: _item.id,
          left:
            _item.pos.left +
            (FLOW_CHART_ITEMS_STYLE[_item.elType].connectorPosition[1] === 'left'
              ? 0
              : FLOW_CHART_ITEMS_STYLE[_item.elType].width),
          top:
            FLOW_CHART_ITEMS_STYLE[_item.elType].connectorPosition[0] === 'bottom'
              ? _item.pos.top +
                FLOW_CHART_ITEMS_STYLE[_item.elType].height -
                CONNECT_POINT_START -
                i * (CONNECT_POINT_SIZE + CONNECT_POINT_GAP)
              : _item.pos.top + CONNECT_POINT_START + i * (CONNECT_POINT_SIZE + CONNECT_POINT_GAP),
          index: i,
        }))
    );
  }, [orderedChartItems]);

  const connectedPointList: PointPos[][] = useMemo(() => {
    return Object.values(chartItems)
      .reduce((_acc, _cur) => {
        const ids = _acc.map((_pointPoses) => {
          return (_pointPoses || []).map((_pos) => _pos.id).join();
        });

        const c = chartItemConnectPoints[_cur.id].map((_point1, index) => {
          if (_cur.connectionIds[index] && !ids.includes([_cur.id, _cur.connectionIds[index]].sort().join())) {
            const _point2 =
              chartItemConnectPoints[_cur.connectionIds[index]][
                chartItems[_cur.connectionIds[index]].connectionIds.indexOf(_cur.id)
              ];

            return [_point1, _point2].sort((a, b) => {
              if (a.id < b.id) {
                return -1;
              }
              if (b.id < a.id) {
                return 1;
              }

              return 0;
            });
          }
        });

        return [..._acc, ...c];
      }, [] as PointPos[][])
      .filter((_p) => !!_p);
  }, [chartItems, chartItemConnectPoints]);

  console.log('connectedPointList', connectedPointList);

  useEffect(() => {
    if (lineCanvasRef.current && connectedCanvasRef.current) {
      const lineCanvas = lineCanvasRef.current;
      const connectedCanvas = connectedCanvasRef.current;

      lineCanvas.width = lineCanvas.parentElement.clientWidth;
      lineCanvas.height = lineCanvas.parentElement.clientHeight;
      connectedCanvas.width = connectedCanvas.parentElement.clientWidth;
      connectedCanvas.height = connectedCanvas.parentElement.clientHeight;

      const lineCtx = lineCanvas.getContext('2d');
      const connectedCtx = lineCanvas.getContext('2d');

      setLineCanvasCtx(lineCtx);
      setConnectedCanvasCtx(connectedCtx);
    }
  }, [lineCanvasRef, connectedCanvasRef]);

  useEffect(() => {
    if (lineCanvasCtx) {
      lineCanvasCtx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height);

      if (selectedConnectionPoint) {
        const originPoint = chartItemConnectPoints[selectedConnectionPoint.id][selectedConnectionPoint.index];

        const _nextPoint = getConnectPoint(selectedConnectionPoint.left, selectedConnectionPoint.top);
        drawConnectionPointLine(originPoint, _nextPoint);
      }
    }
  }, [lineCanvasCtx, selectedConnectionPoint]);

  const drawConnectionPointLine = (_origin: PointPos, _next: PointPos) => {
    const GAP = 20;

    lineCanvasCtx.beginPath();
    lineCanvasCtx.moveTo(_origin.left, _origin.top);

    if (_next && _next.id !== selectedConnectionPoint.id) {
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

      const originHorConnectPos =
        FLOW_CHART_ITEMS_STYLE[chartItems[selectedConnectionPoint.id].elType].connectorPosition[1];
      const horConnectPos = FLOW_CHART_ITEMS_STYLE[chartItems[_next.id].elType].connectorPosition[1];

      if (originHorConnectPos === 'right' && horDir === 'right' && horConnectPos === 'right') {
        lineCanvasCtx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _origin.top);
        lineCanvasCtx.lineTo(_origin.left + Math.max(_next.left - _origin.left, 0) + GAP, _next.top);
      } else if (originHorConnectPos === 'right' && horDir === 'right' && horConnectPos === 'left') {
        lineCanvasCtx.lineTo(_origin.left + Math.max((_next.left - _origin.left) / 2, 0), _origin.top);
        lineCanvasCtx.lineTo(_origin.left + Math.max((_next.left - _origin.left) / 2, 0), _next.top);
      } else if (originHorConnectPos === 'right' && horDir === 'left' && horConnectPos === 'left') {
        lineCanvasCtx.lineTo(_origin.left + GAP, _origin.top);
        lineCanvasCtx.lineTo(_origin.left + GAP, Math.max((_next.top + _origin.top) / 2, 0));
        lineCanvasCtx.lineTo(_next.left - GAP, Math.max((_next.top + _origin.top) / 2, 0));
        lineCanvasCtx.lineTo(_next.left - GAP, _next.top);
      }
      lineCanvasCtx.lineTo(_next.left, _next.top);
    } else {
      lineCanvasCtx.lineTo(selectedConnectionPoint.left, selectedConnectionPoint.top);
    }

    lineCanvasCtx.stroke();
  };

  const getConnectPoint = (_x: number, _y: number): PointPos => {
    const _points = Object.values(chartItemConnectPoints)
      .flat()
      .filter(
        (_pos) =>
          _pos.left - CONNECT_POINT_SIZE / 2 <= _x &&
          _x <= CONNECT_POINT_SIZE + _pos.left &&
          _pos.top - CONNECT_POINT_SIZE / 2 <= _y &&
          _y <= CONNECT_POINT_SIZE + _pos.top
      );

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
      const _connected = getConnectPoint(selectedConnectionPoint.left, selectedConnectionPoint.top);
      _connected && connectPoints(selectedConnectionPoint.id, _connected.id);
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
        <ChartItem key={_itemInfo.id} itemInfo={_itemInfo} setSelectedConnectionPoint={setSelectedConnectionPoint} />
      ))}
    </div>
  );
}

export default FlowChart;
