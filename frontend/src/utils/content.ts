import _ from 'lodash';
import { useCallback, useState } from 'react';

import {
  ChartItemType,
  ChartUtilsItems,
  ChartVariableItem,
  CodeFlowChartDoc,
  ConnectPoint,
} from '@/consts/types/codeFlowLab';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';
import { CHART_VARIABLE_ITEMS } from '@/consts/codeFlowLab/items';
export * from './connect-point';

interface imageSize {
  width: number;
  height: number;
}
export const getImageSize = (_src: string): Promise<imageSize> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      reject('fail to load image');
    };

    img.src = _src;
  });
};

type makeDocumentParams = {
  document: any;
  keys: string[];
  value: any;
};
type makeNewDocument = (makeDocumentParams: makeDocumentParams) => CodeFlowChartDoc;
export const makeNewDocument: makeNewDocument = ({ document: _document, keys: _keys, value: _value }) => {
  let mapFunction = null;

  if (_.isArray(_document)) {
    mapFunction = _.map;
  } else {
    mapFunction = _.mapValues;
  }

  return mapFunction(_document, (prop, propKey) => {
    if (_keys.length > 1 && propKey + '' === _keys[0] + '') {
      _keys.shift();

      return makeNewDocument({
        document: prop,
        keys: _keys,
        value: _value,
      });
    } else if (_keys.length === 1 && propKey + '' === _keys[0] + '') {
      return _value;
    }

    return prop;
  });
};

export const getDocumentValue = ({ document: _document, keys: _keys }) => {
  return _keys.reduce((acc, val) => (acc ? acc[val] : ''), _document);
};

export const getSceneId = (_flowScene: CodeFlowChartDoc['scene'], _sceneOrder: number) =>
  Object.keys(_flowScene).filter((_sceneKey) => _flowScene[_sceneKey].order === _sceneOrder)?.[0] || '';

export const getChartItem = (sceneItemIdList: string[], chartItem: CodeFlowChartDoc['items']) => {
  return _.pickBy(chartItem, (_item) => (sceneItemIdList || []).includes(_item.id));
};

export const useDebounceSubmitText = (_dispatchKey, _debounceCallbak = undefined) => {
  const [dispatchKey, setDispatchKey] = useState(_dispatchKey);
  const dispatch = useDispatch();

  const onChange = useCallback(
    _.debounce((_text) => {
      dispatch(
        setDocumentValueAction({
          key: dispatchKey,
          value: _text,
        })
      );

      _debounceCallbak && _debounceCallbak(_text);
    }, 800),
    []
  );

  return [onChange];
};

export const getRandomId = (_length = 8) => {
  return 'fI_' + nanoid(_length);
};

const getSize = (_target: string, _id: string, _key: string) => {
  if (_key) {
    const rgxp = new RegExp(_key, 'g');
    return _target.match(rgxp).length;
  } else {
    return _target.length;
  }
};

export const getVariables = (_sceneId: string, _items: CodeFlowChartDoc['items'], sceneItemIdList: string[]) => {
  let searched = {};

  const searchUtilsVariableLoop = (_items: CodeFlowChartDoc['items'], _item: ChartUtilsItems) => {
    if (!_item.connectionVariables[0]) {
      return undefined;
    }

    if (searched[_item.id]) {
      return searched[_item.id];
    }

    const _targetId = _item.connectionVariables[0].connectParentId;

    if (!CHART_VARIABLE_ITEMS.includes(_items[_targetId].elType)) {
      return undefined;
    }

    let __var;

    if (_items[_targetId].elType !== ChartItemType.variable) {
      __var = searchUtilsVariableLoop(_items, _items[_targetId] as ChartUtilsItems);

      searched = {
        ...searched,
        [_targetId]: __var,
      };
    } else {
      __var = (_items[_targetId] as ChartVariableItem).var;
    }

    switch (_item.elType) {
      case ChartItemType.size:
        return getSize(`${__var}`, _targetId, _item.text);
      case ChartItemType.includes:
        return `${__var}`.includes(_item.text) ? 1 : 0;
      case ChartItemType.indexOf:
        return `${__var}`.indexOf(_item.text);

      default:
        return undefined;
    }
  };

  const _variableItemList = _.pickBy(_items, (_item) => {
    if (_item.elType === ChartItemType.variable) {
      return _item.sceneId === _sceneId || !_item.sceneId;
    } else if (sceneItemIdList.includes(_item.id) && CHART_VARIABLE_ITEMS.includes(_item.elType)) {
      return true;
    }

    return false;
  });

  return _.mapValues(_variableItemList, (_item) => {
    switch (_item.elType) {
      case ChartItemType.variable:
        return _item.var;

      case ChartItemType.condition:
        const __code = _item.textList.reduce((_acc, _cur, _index) => {
          let _text = '';

          const _varId = _item.connectionVariables[_index]?.connectParentId;
          const _var = (_items?.[_varId] as ChartVariableItem)?.var;

          if (_index !== 0) {
            _text += _item.conditions;
          }

          _text += JSON.stringify(_var || _cur);

          return _acc + _text;
        }, '');

        const conditionResult = new Function(`return ${__code}`)();

        return conditionResult ? 1 : 0;
      case ChartItemType.size:
      case ChartItemType.includes:
      case ChartItemType.indexOf:
        return searchUtilsVariableLoop(_items, _item);
      default:
        return undefined;
    }
  });
};
