import classNames from 'classnames/bind';
import styles from './flowChart.module.scss';
const cx = classNames.bind(styles);
//
import { FLOW_CHART_ITEMS_STYLE } from '@/consts/codeFlowLab/items';
import { ChartItem, ChartItemType, ChartItems } from '@/consts/types/codeFlowLab';
import { MouseEventHandler, useEffect, useRef } from 'react';

interface Props {
  chartItems: ChartItems[];
}
function FlowChart({ chartItems }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (_ctx: CanvasRenderingContext2D, _item: ChartItem) => {
    const _elType = _item.elType;

    switch (_item.elType) {
      case ChartItemType.button:
        _ctx.beginPath();
        _ctx.rect(
          _item.pos.left,
          _item.pos.top,
          FLOW_CHART_ITEMS_STYLE[_elType].width,
          FLOW_CHART_ITEMS_STYLE[_elType].height
        );
        _ctx.stroke();

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

      chartItems.forEach((_it) => draw(ctx, _it));
    }
  }, [canvasRef]);

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (_event) => {
    console.log(_event.movementX);
  };

  return <canvas ref={canvasRef} className={cx('flow-chart')} onMouseMove={handleMouseMove} />;
}

export default FlowChart;
