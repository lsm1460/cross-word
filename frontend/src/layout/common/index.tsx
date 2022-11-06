import styles from './common.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
interface Props {
  children;
}
function CommonLayout({ children }: Props) {
  return <div className={cx('container')}>{children}</div>;
}

export default CommonLayout;
