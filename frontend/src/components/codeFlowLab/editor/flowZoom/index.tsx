import classNames from 'classnames/bind';
import styles from './flowZoom.module.scss';
const cx = classNames.bind(styles);
//

import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import React, { MouseEventHandler, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { FLOW_CHART_ITEMS_STYLE } from '@/consts/codeFlowLab/items';

interface Props {
  chartItems: CodeFlowChartDoc['items'];
  children: ReactElement<any | string>;
}
function FlowZoom({ chartItems, children }: Props) {
  const zoomRef = useRef<HTMLDivElement>(null);

  const [originSize, setOriginSize] = useState([0, 0]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (zoomRef.current) {
      const { width, height } = zoomRef.current.getBoundingClientRect();

      setOriginSize([width, height]);
    }
  }, [zoomRef]);

  const scrollArea = useMemo(() => {
    const [width, height] = originSize;

    const xCenter = width / 2 / scale;
    const yCenter = height / 2 / scale;

    let maxX = 0;
    let maxY = 0;

    for (let _id in chartItems) {
      const _item = chartItems[_id];

      const _maxX = Math.max(
        Math.abs(_item.pos.left - xCenter),
        FLOW_CHART_ITEMS_STYLE[_item.elType].width + _item.pos.left - xCenter
      );
      const _maxY = Math.max(
        Math.abs(_item.pos.top - yCenter),
        FLOW_CHART_ITEMS_STYLE[_item.elType].height + _item.pos.top - yCenter
      );

      maxX = maxX > _maxX ? maxX : _maxX;
      maxY = maxY > _maxY ? maxY : _maxY;
    }

    const scrollX = Math.max(maxX * 2 - width / scale, 0);
    const scrollY = Math.max(maxY * 2 - height / scale, 0);

    return [scrollX, scrollY];
  }, [originSize, chartItems, scale]);

  const handleZoom: MouseEventHandler<HTMLButtonElement> = (_event) => {
    const buttonEl = _event.nativeEvent.target as HTMLButtonElement;

    const zoomType = buttonEl.dataset.zoomType as 'in' | 'out';

    if (zoomType === 'in') {
      setScale((_prev) => Math.min(_prev + 0.1, 2));
    } else {
      setScale((_prev) => Math.max(_prev - 0.1, 0.5));
    }
  };

  return (
    <div className={cx('zoom-area-wrap')} ref={zoomRef}>
      <div
        className={cx('zoom-area')}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {React.cloneElement(children, { scale })}
      </div>
      <ul className={cx('zoom-btn-list')}>
        <li>
          <button className="material-icons" onClick={handleZoom} data-zoom-type={'in'}>
            zoom_in
          </button>
        </li>
        <li>
          <button className="material-icons" onClick={handleZoom} data-zoom-type={'out'}>
            zoom_out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default FlowZoom;
