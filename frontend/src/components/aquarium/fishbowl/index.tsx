import classNames from 'classnames/bind';
import styles from './fishbowl.module.scss';
const cx = classNames.bind(styles);
import { FishInfo } from '@/consts/types/aquarium';
//
interface Props {
  fishes: FishInfo[];
}
function Fishbowl({ fishes }: Props) {
  return <div className={cx('fish-bowl')}></div>;
}

export default Fishbowl;
