import { ChartItemType, ChartItems } from '@/consts/types/codeFlowLab';
import StyleEditBlock from './styleEditBlock';
import TriggerEditBlock from './triggerEditBlock';

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

      default:
        return <></>;
    }
  };

  return <div>{drawInnerBlock()}</div>;
}

export default PropertiesEditBlock;
