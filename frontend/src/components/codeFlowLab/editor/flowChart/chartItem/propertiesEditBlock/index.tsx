import classNames from 'classnames/bind';
import styles from './propertiesEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems } from '@/consts/types/codeFlowLab';
import StyleEditBlock from './styleEditBlock';
import TriggerEditBlock from './triggerEditBlock';
import TextEditBlock from './textEditBlock';

interface Props {
  chartItem: ChartItems;
}
function PropertiesEditBlock({ chartItem }: Props) {
  const drawInnerBlock = () => {
    switch (chartItem.elType) {
      case ChartItemType.style:
        return <StyleEditBlock id={chartItem.id} styles={chartItem.styles} />;
      case ChartItemType.trigger:
        return <TriggerEditBlock id={chartItem.id} triggerType={chartItem.triggerType} />;
      case ChartItemType.span:
        return <TextEditBlock id={chartItem.id} text={chartItem.text} />;

      default:
        return <></>;
    }
  };

  return (
    <div className={cx('property-block-wrap')}>
      <div>{drawInnerBlock()}</div>
    </div>
  );
}

export default PropertiesEditBlock;
