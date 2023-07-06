import classNames from 'classnames/bind';
import styles from './flowToolbar.module.scss';
const cx = classNames.bind(styles);
//
import { useState } from 'react';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import ToolbarPanel from './panel';

interface Props {
  makeItem: (_itemType: ChartItemType) => void;
}
function FlowToolbar({ makeItem }: Props) {
  const [panel, setPanel] = useState<'element' | 'function' | ''>('');

  return (
    <div className={cx('toolbar')}>
      <ul>
        <li className={cx('toolbar-item', 'element', { active: panel === 'element' })}>
          <button onClick={() => setPanel((_prev) => (_prev !== 'element' ? 'element' : ''))}>Element</button>
        </li>
        <li className={cx('toolbar-item', 'style')}>
          <button onClick={() => makeItem(ChartItemType.style)}>Style</button>
        </li>
        <li className={cx('toolbar-item', 'trigger')}>
          <button onClick={() => makeItem(ChartItemType.trigger)}>Trigger</button>
        </li>
        <li className={cx('toolbar-item', 'function', { active: panel === 'function' })}>
          <button onClick={() => setPanel((_prev) => (_prev !== 'function' ? 'function' : ''))}>Function</button>
        </li>
      </ul>

      <ToolbarPanel activePanel={panel} handleClosePanel={() => setPanel('')} />
    </div>
  );
}

export default FlowToolbar;
