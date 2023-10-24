import classNames from 'classnames/bind';
import styles from './linkEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartLinkItem } from '@/consts/types/codeFlowLab';
import TextEditBlock from '../textEditBlock';

interface Props {
  id: string;
  link: ChartLinkItem['link'];
}
function LinkEditBlock({ id, link }: Props) {
  return (
    <div className={cx('property-wrap')}>
      <p>link</p>
      <TextEditBlock id={id} text={link} propertyKey="link" />
    </div>
  );
}

export default LinkEditBlock;
