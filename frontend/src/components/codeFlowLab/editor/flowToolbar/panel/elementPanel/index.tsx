import classNames from 'classnames/bind';
import styles from '../panel.module.scss';
const cx = classNames.bind(styles);
//
import { CHART_ELEMENT_ITEMS } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import PanelItem from '../panelItem';

function ElementPanel() {
  const itemList = CHART_ELEMENT_ITEMS.filter((_type) => _type !== ChartItemType.body);

  return (
    <ul className={cx('panel-item-list')}>
      {itemList.map((_type) => (
        <li key={_type}>
          <PanelItem itemType={_type} />
        </li>
      ))}
    </ul>
  );
}

export default ElementPanel;
