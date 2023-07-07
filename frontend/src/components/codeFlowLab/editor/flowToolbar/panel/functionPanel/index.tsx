import classNames from 'classnames/bind';
import styles from '../panel.module.scss';
const cx = classNames.bind(styles);
//
import PanelItem from '../panelItem';

function FunctionPanel() {
  const itemList = [];

  return (
    <ul className={cx('panel-item-list')}>
      {itemList.map((_type) => (
        <li>
          <PanelItem itemType={_type} />
        </li>
      ))}
    </ul>
  );
}

export default FunctionPanel;
