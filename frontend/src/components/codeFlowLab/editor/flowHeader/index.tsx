import classNames from 'classnames/bind';
import styles from './flowHeader.module.scss';
const cx = classNames.bind(styles);
//

function FlowHeader() {
  return <header className={cx('header')}></header>;
}

export default FlowHeader;
