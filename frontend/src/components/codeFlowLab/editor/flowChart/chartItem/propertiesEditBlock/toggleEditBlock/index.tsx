import classNames from 'classnames/bind';
import styles from './toggleEditBlock.module.scss';
const cx = classNames.bind(styles);
//

interface Props {
  label: string;
  toggleCallback: (_result: boolean) => void;
}
function ToggleEditBlock({ label, toggleCallback }: Props) {
  return (
    <label className={cx('toggle-switch')}>
      <span>{label}</span>
      <input type="checkbox" hidden />
      <span className={cx('toggle-button')}></span>
    </label>
  );
}

export default ToggleEditBlock;
