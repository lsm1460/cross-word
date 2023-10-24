import {
  ChartItemType,
  ChartStyleItem,
  ScriptAddStyleItem,
  ScriptChangeValueItem,
  ScriptConsoleItem,
  ScriptIfItem,
  ScriptItem,
  ScriptLoopItem,
  ScriptMoveNextSceneItem,
  ScriptMovePrevSceneItem,
  ScriptMoveSceneItem,
  ScriptRemoveStyleItem,
  ScriptToggleStyleItem,
  ScriptTriggerItem,
  TriggerName,
  TriggerProps,
  ViewerItem,
} from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import {
  setAddedStylesAction,
  setDocumentValueAction,
  setFlowLogAction,
  setRemoveStylesAction,
  setSceneOrderAction,
  setToggleStylesAction,
} from '@/reducers/contentWizard/mainDocument';
import { getElementTrigger } from '@/src/utils/content';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsVisible } from 'react-is-visible';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ViewerBodyBlock from './viewerBodyBlock';
import ViewerButtonBlock from './viewerButtonBlock';
import ViewerDivBlock from './viewerDivBlock';
import ViewerInputBlock from './viewerInputBlock';
import ViewerLinkBlock from './viewerLinkBlock';
import ViewerParagraphBlock from './viewerParagraphBlock';
import ViewerSpanBlock from './viewerSpanBlock';
interface Props {
  viewerItem: ViewerItem;
  variables: {
    [x: string]: any;
  };
}
function ViewerElBlock({ viewerItem, variables }: Props) {
  const dispatch = useDispatch();

  const { addedStyle, sceneOrder, scene } = useSelector(
    (state: RootState) => ({
      addedStyle: state.mainDocument.addedStyles[viewerItem.id] || {},
      sceneOrder: state.mainDocument.sceneOrder,
      scene: state.mainDocument.contentDocument.scene,
    }),
    shallowEqual
  );

  const executeConditionScript = (_scriptBlock: ScriptIfItem) => {
    const __code = _scriptBlock.connectionVariables
      .filter((_var) => _var.connectType === 'variable')
      .reduce((_acc, _cur, _index) => {
        let _text = '';

        if (_index !== 0) {
          _text += _scriptBlock.conditions?.[_cur.connectParentId] || '&&';
        }
        _text += variables[_cur.connectParentId];

        return _acc + _text;
      }, '');

    const conditionResult = new Function(`return ${__code}`)();

    if (conditionResult) {
      executeScriptBlock(_scriptBlock.script[0]);
    } else {
      executeScriptBlock(_scriptBlock.script[1]);
    }
  };

  const executeLoopScript = (_scriptBlock: ScriptLoopItem) => {
    const [_vStart, _vEnd, _vIncrease] = new Array(3)
      .fill(undefined)
      .map((__, _i) => parseInt(variables[_scriptBlock.connectionVariables?.[_i]?.connectParentId] as string, 10));

    for (
      let _i = _.isNaN(_vStart) ? _scriptBlock.loop.start : _vStart || 0;
      _i < (_.isNaN(_vEnd) ? _scriptBlock.loop.end : _vEnd || 1);
      _i = _i + (_.isNaN(_vIncrease) ? _scriptBlock.loop.increase : _vIncrease || 1)
    ) {
      for (let scriptBlock of _scriptBlock.script) {
        executeScriptBlock(scriptBlock);
      }
    }
  };

  const executeConsoleScript = (_scriptBlock: ScriptConsoleItem) => {
    const _var = variables[_scriptBlock.connectionVariables[0]?.connectParentId];
    const _date = dayjs().format('HH:mm ss');

    dispatch(
      setFlowLogAction({
        date: _date,
        text: _.isUndefined(_var) ? _scriptBlock.text : (_var as string),
        type: 'log',
      })
    );
  };

  const executeChangeValueScript = (_scriptBlock: ScriptChangeValueItem) => {
    const _varId = _scriptBlock.connectionVariables[0]?.connectParentId;
    let _var = variables[_scriptBlock.connectionVariables[1]?.connectParentId] || _scriptBlock.text;
    let _result = _var;

    if (!_varId) {
      return;
    }

    let _targetVar = variables[_varId];

    if (_scriptBlock.isNumber) {
      _targetVar = parseInt(_targetVar, 10) || (_targetVar ? 1 : 0);
      _var = parseInt(_var, 10) || (_var ? 1 : 0);
    } else {
      _targetVar = `'${_targetVar}'`;
      _var = `'${_var}'`;
    }

    _result = new Function(`let a = ${_targetVar}; return a ${_scriptBlock.operator} ${_var}`)();

    dispatch(
      setDocumentValueAction({
        key: `items.${_varId}.var`,
        value: _result,
        isSkip: true,
      })
    );
  };

  const executeAddStyle = (_scriptBlock: ScriptAddStyleItem | ScriptRemoveStyleItem | ScriptToggleStyleItem) => {
    if (!_scriptBlock.elId) {
      return;
    }

    const _styles = _scriptBlock.script.reduce((_acc, _cur: ChartStyleItem) => {
      return {
        ..._acc,
        ..._cur.styles,
      };
    }, {});

    if (_scriptBlock.elType === ChartItemType.addStyle) {
      dispatch(setAddedStylesAction({ id: _scriptBlock.elId, style: _styles }));
    } else if (_scriptBlock.elType === ChartItemType.removeStyle) {
      dispatch(setRemoveStylesAction({ id: _scriptBlock.elId, style: _styles }));
    } else {
      dispatch(setToggleStylesAction({ id: _scriptBlock.elId, style: _styles }));
    }
  };

  const executeMoveScene = (_scriptBlock: ScriptMoveSceneItem | ScriptMoveNextSceneItem | ScriptMovePrevSceneItem) => {
    let targetSceneOrder = 0;

    if (_scriptBlock.elType === ChartItemType.moveScene) {
      targetSceneOrder =
        parseInt(variables[_scriptBlock.connectionVariables?.[0]?.connectParentId] as string, 10) ||
        _scriptBlock.sceneOrder;
    } else if (_scriptBlock.elType === ChartItemType.moveNextScene) {
      targetSceneOrder = sceneOrder + 1;
    } else {
      targetSceneOrder = sceneOrder - 1;
    }

    targetSceneOrder = Math.min(Math.max(0, targetSceneOrder), Object.keys(scene).length);

    if (targetSceneOrder === sceneOrder) {
      return;
    }

    dispatch(setSceneOrderAction(targetSceneOrder));
  };

  const executeScriptBlock = (_scriptBlock: ScriptItem | ChartStyleItem) => {
    if (!_scriptBlock || _scriptBlock.elType === ChartItemType.style) {
      return;
    }

    switch (_scriptBlock?.elType) {
      case ChartItemType.if:
        executeConditionScript(_scriptBlock);
        break;
      case ChartItemType.loop:
        executeLoopScript(_scriptBlock);
        break;
      case ChartItemType.console:
        executeConsoleScript(_scriptBlock);
        break;
      case ChartItemType.changeValue:
        executeChangeValueScript(_scriptBlock);
        break;
      case ChartItemType.addStyle:
      case ChartItemType.removeStyle:
      case ChartItemType.toggleStyle:
        executeAddStyle(_scriptBlock);
        break;
      case ChartItemType.moveScene:
      case ChartItemType.moveNextScene:
      case ChartItemType.movePrevScene:
        executeMoveScene(_scriptBlock);
        break;

      default:
        break;
    }

    if (![ChartItemType.loop, ChartItemType.if].includes(_scriptBlock.elType)) {
      for (let scriptBlock of _scriptBlock?.script || []) {
        executeScriptBlock(scriptBlock);
      }
    }
  };

  const triggerProps: TriggerProps = useMemo(
    () =>
      viewerItem.triggers.reduce(
        (_acc, _cur: ScriptTriggerItem) => ({
          ..._acc,
          [TriggerName[_cur.triggerType]]: () => {
            for (let scriptBlock of _cur.script) {
              executeScriptBlock(scriptBlock);
            }
          },
        }),
        {}
      ),
    [viewerItem]
  );

  const elementTriggerProps = useMemo(() => getElementTrigger(triggerProps), [triggerProps]);

  const elementRef = useRef(null);
  const isVisible = useIsVisible(elementRef);

  const [isFirstShow, setIsFirstShow] = useState(false);

  useEffect(() => {
    if (triggerProps.load) {
      triggerProps.load();
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsFirstShow(true);

      if (triggerProps.visible) {
        triggerProps.visible();
      }
    } else {
      if (isFirstShow && triggerProps.invisible) {
        triggerProps.invisible();
      }
    }
  }, [isVisible, isFirstShow]);

  const childProps = {
    elRef: elementRef,
    triggerProps: elementTriggerProps,
    viewerItem,
    variables,
    addedStyle,
  };

  return (
    <>
      {
        {
          [ChartItemType.body]: <ViewerBodyBlock {...childProps} />,
          [ChartItemType.div]: <ViewerDivBlock {...childProps} />,
          [ChartItemType.button]: <ViewerButtonBlock {...childProps} />,
          [ChartItemType.paragraph]: <ViewerParagraphBlock {...childProps} />,
          [ChartItemType.span]: <ViewerSpanBlock {...childProps} />,
          [ChartItemType.link]: <ViewerLinkBlock {...childProps} />,
          [ChartItemType.input]: <ViewerInputBlock {...childProps} />,
        }[viewerItem.elType]
      }
    </>
  );
}

export default ViewerElBlock;
