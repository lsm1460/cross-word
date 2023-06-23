import classNames from 'classnames/bind';
import styles from './flowToolbar.module.scss';
const cx = classNames.bind(styles);
//
function FlowToolbar() {
  return <div className={cx('toolbar')}></div>;
}

export default FlowToolbar;
