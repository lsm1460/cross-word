import classNames from 'classnames/bind';
import styles from './flowZoom.module.scss';
const cx = classNames.bind(styles);
//

import React, { MouseEventHandler, ReactElement, ReactNode, useState } from 'react';

interface Props {
  children: ReactElement<any | string>;
}
function FlowZoom({ children }: Props) {
  const [scale, setScale] = useState(1);

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
    <div className={cx('zoom-area-wrap')}>
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
