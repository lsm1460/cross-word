import classNames from 'classnames/bind';
import styles from './propertiesEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems } from '@/consts/types/codeFlowLab';
import StyleEditBlock from './styleEditBlock';
import TriggerEditBlock from './triggerEditBlock';
import TextEditBlock from './textEditBlock';
import VariableEditBlock from './variableEditBlock';
import { MouseEventHandler } from 'react';

interface Props {
  chartItem: ChartItems;
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
}
function PropertiesEditBlock({ chartItem, handlePointConnectStart }: Props) {
  const drawInnerBlock = () => {
    switch (chartItem.elType) {
      case ChartItemType.style:
        return <StyleEditBlock id={chartItem.id} styles={chartItem.styles} />;
      case ChartItemType.trigger:
        return <TriggerEditBlock id={chartItem.id} triggerType={chartItem.triggerType} />;
      case ChartItemType.span:
      case ChartItemType.console:
        return (
          <TextEditBlock
            id={chartItem.id}
            text={chartItem.text}
            propertyKey={'text'}
            pointInfo={{
              pointIndex: 0,
              connectPoint: chartItem.connectionVariables[0],
              handlePointConnectStart,
            }}
          />
        );
      case ChartItemType.variable:
        return <VariableEditBlock id={chartItem.id} variable={chartItem.var} />;

      default:
        return <></>;
    }
  };

  return (
    <div className={cx('property-block-wrap')}>
      <p className={cx('block-el-type')}>Block Type: {chartItem.elType}</p>
      <div>{drawInnerBlock()}</div>
    </div>
  );
}

export default PropertiesEditBlock;
