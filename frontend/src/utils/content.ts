import _ from 'lodash';
import { useCallback, useState } from 'react';

import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { DocumentState, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';

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
  return nanoid(_length);
};
