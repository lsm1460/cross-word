import { ChartItemType, ScriptItem, ScriptTriggerItem, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerButtonBlock from './viewerButtonBlock';
import ViewerDivBlock from './viewerDivBlock';
import ViewerParagraphBlock from './viewerParagraphBlock';
import ViewerSpanBlock from './viewerSpanBlock';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerElBlock({ viewerItem }: Props) {
  const convertTriggerName = {
    click: 'onClick',
  };

  const executeScriptBlock = (_scriptBlock: ScriptItem) => {
    switch (_scriptBlock.elType) {
      case ChartItemType.loop:
        for (
          let _i = Number(_scriptBlock.start);
          _i < Number(_scriptBlock.end);
          _i = _i + Number(_scriptBlock.increase)
        ) {
          console.log('test..');
        }
        break;
      case ChartItemType.console:
        console.log('test..2');
        break;

      default:
        break;
    }

    for (let scriptBlock of _scriptBlock.script) {
      executeScriptBlock(scriptBlock);
    }
  };

  const triggerProps = viewerItem.triggers.reduce((_acc, _cur: ScriptTriggerItem) => {
    return {
      ..._acc,
      [convertTriggerName[_cur.triggerType]]: () => {
        for (let scriptBlock of _cur.script) {
          executeScriptBlock(scriptBlock);
        }
      },
    };
  }, {});

  return (
    <>
      {
        {
          [ChartItemType.div]: <ViewerDivBlock viewerItem={viewerItem} triggerProps={triggerProps} />,
          [ChartItemType.button]: <ViewerButtonBlock viewerItem={viewerItem} triggerProps={triggerProps} />,
          [ChartItemType.paragraph]: <ViewerParagraphBlock viewerItem={viewerItem} triggerProps={triggerProps} />,
          [ChartItemType.span]: <ViewerSpanBlock viewerItem={viewerItem} triggerProps={triggerProps} />,
        }[viewerItem.elType]
      }
    </>
  );
}

export default ViewerElBlock;
