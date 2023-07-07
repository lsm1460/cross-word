import _ from 'lodash';
import { useCallback, useState } from 'react';

import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
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

export const useDebounceSubmitText = (_dispatchKey) => {
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
    }, 800),
    []
  );

  return [onChange];
};
