import { ChartConsoleItem, ChartItemType, ScriptItem, ScriptTriggerItem, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerButtonBlock from './viewerButtonBlock';
import ViewerDivBlock from './viewerDivBlock';
import ViewerParagraphBlock from './viewerParagraphBlock';
import ViewerSpanBlock from './viewerSpanBlock';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { getSceneId, getVariables } from '@/src/utils/content';
import _ from 'lodash';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerElBlock({ viewerItem }: Props) {
  const variables = useSelector((state: RootState) => {
    const sceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return getVariables(sceneId, state.mainDocument.contentDocument.items);
  }, shallowEqual);

  const convertTriggerName = {
    click: 'onClick',
  };

  const executeScriptBlock = (_scriptBlock: ScriptItem) => {
    switch (_scriptBlock.elType) {
      case ChartItemType.loop:
        const _vStart = parseInt(variables[_scriptBlock.connectionVariables?.[0]?.connectParentId], 10);
        const _vEnd = parseInt(variables[_scriptBlock.connectionVariables?.[1]?.connectParentId], 10);
        const _vIncrease = parseInt(variables[_scriptBlock.connectionVariables?.[2]?.connectParentId], 10);

        for (
          let _i = _.isNaN(_vStart) ? _scriptBlock.loop.start : _vStart || 0;
          _i < (_.isNaN(_vEnd) ? _scriptBlock.loop.end : _vEnd || 1);
          _i = _i + (_.isNaN(_vIncrease) ? _scriptBlock.loop.increase : _vIncrease || 1)
        ) {
          for (let scriptBlock of _scriptBlock.script) {
            executeScriptBlock(scriptBlock);
          }
        }
        break;
      case ChartItemType.console:
        const _var = variables[_scriptBlock.connectionVariables[0]?.connectParentId];
        console.log(_.isUndefined(_var) ? _scriptBlock.text : _var);

        break;

      default:
        break;
    }

    if (_scriptBlock.elType !== ChartItemType.loop) {
      for (let scriptBlock of _scriptBlock.script) {
        executeScriptBlock(scriptBlock);
      }
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
