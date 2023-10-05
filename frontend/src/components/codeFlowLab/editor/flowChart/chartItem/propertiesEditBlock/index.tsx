import classNames from 'classnames/bind';
import styles from './propertiesEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems } from '@/consts/types/codeFlowLab';
import StyleEditBlock from './styleEditBlock';
import TriggerEditBlock from './triggerEditBlock';
import TextEditBlock from './textEditBlock';
import VariableEditBlock from './variableEditBlock';
import { MouseEventHandler, useEffect } from 'react';
import LoopEditBlock from './loopEditBlock';
import IfEditBlock from './ifEditBlock';

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
        return <VariableEditBlock id={chartItem.id} isGlobal={!chartItem.sceneId} variable={chartItem.var} />;
      case ChartItemType.loop:
        return (
          <LoopEditBlock
            id={chartItem.id}
            loop={chartItem.loop}
            connectionVariables={chartItem.connectionVariables}
            handlePointConnectStart={handlePointConnectStart}
          />
        );
      case ChartItemType.if:
        return (
          <IfEditBlock
            id={chartItem.id}
            conditions={chartItem.conditions}
            connectionVariables={chartItem.connectionVariables}
            handlePointConnectStart={handlePointConnectStart}
          />
        );

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
