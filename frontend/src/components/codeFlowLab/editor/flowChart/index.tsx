import classNames from 'classnames/bind';
import styles from './flowChart.module.scss';
const cx = classNames.bind(styles);
//
import { CONNECT_POINT_GAP, CONNECT_POINT_SIZE, FLOW_CHART_ITEMS_STYLE } from '@/consts/codeFlowLab/items';
import { ChartItem, ChartItemType, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import _ from 'lodash';
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { MoveItems } from '..';

type PointPos = { id: string; left: number; top: number };

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  moveItems: MoveItems;
}
function FlowChart({ chartItems, moveItems }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedItemIds, setSelectedItemIds] = useState([]);

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
          left: _item.pos.left + FLOW_CHART_ITEMS_STYLE[_item.elType].width,
          top:
            _item.pos.top +
            FLOW_CHART_ITEMS_STYLE[_item.elType].height -
            (CONNECT_POINT_GAP + CONNECT_POINT_SIZE) * (i + 1),
        }))
    );
  }, [orderedChartItems]);

  const draw = (_ctx: CanvasRenderingContext2D, _item: ChartItem) => {
    const _elType = _item.elType;

    switch (_item.elType) {
      case ChartItemType.button:
        _ctx.save();
        _ctx.strokeRect(
          _item.pos.left,
          _item.pos.top,
          FLOW_CHART_ITEMS_STYLE[_elType].width,
          FLOW_CHART_ITEMS_STYLE[_elType].height
        );
        _ctx.beginPath();

        chartItemConnectPoints[_item.id].forEach((_cPoint) => {
          _ctx.arc(_cPoint.left, _cPoint.top, CONNECT_POINT_SIZE, 0, 2 * Math.PI);
        });
        _ctx.fillStyle = 'black';
        _ctx.fill();
        _ctx.stroke();
        _ctx.restore();

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const ctx = canvas.getContext('2d');

      orderedChartItems.forEach((_it) => draw(ctx, _it));
    }
  }, [canvasRef, chartItems]);

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

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (_event) => {
    // TODO: consider zoom ...
    const selectedPoint = getConnectPoint(_event.clientX, _event.clientY);
    const selectedItem = getItemIdByPos(_event.clientX, _event.clientY);

    if ((chartItems[selectedPoint?.id]?.zIndex || 0) > (selectedItem?.zIndex || 0)) {
      // select point..
      console.log('포인트 클릭');
    } else if ((chartItems[selectedPoint?.id]?.zIndex || 0) < (selectedItem?.zIndex || 0)) {
      // select item..
      setSelectedItemIds([selectedItem.id]);
    } else {
      // multi select..
    }
  };

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (_event) => {
    // TODO: consider zoom ...

    if (selectedItemIds.length > 0) {
      moveItems(selectedItemIds, _event.movementX, _event.movementY);
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = (_event) => {
    setSelectedItemIds([]);
  };

  return (
    <canvas
      ref={canvasRef}
      className={cx('flow-chart')}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}

export default FlowChart;
