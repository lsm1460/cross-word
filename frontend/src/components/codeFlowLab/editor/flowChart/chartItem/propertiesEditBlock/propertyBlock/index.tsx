import classNames from 'classnames/bind';
import styles from './propertyBlock.module.scss';
const cx = classNames.bind(styles);
//
import { SELECTOR_CLASS_PREFIX } from '@/consts/codeFlowLab/items';
import _ from 'lodash';
import Select from 'react-select';
import { KeyboardEventHandler, useCallback, useRef } from 'react';

const SELECT_STYLE = {
  menuList: (base) => ({
    ...base,

    '::-webkit-scrollbar': {
      width: '4px',
      height: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  }),
};

type SelectOption = { value: any; label: string; isDisabled?: boolean };

interface Props {
  id: string;
  propertyKey: string;
  value: number | string;
  onChangeValue: (_key: string, _value: number | string) => void;
  propertyKeyList?: {
    options: SelectOption[];
    onChangeKey: (_beforeKey: string, _key: string) => void;
  };
  valueList?: SelectOption[];
  onDelete?: (_key: string) => void;
}
function PropertyBlock({ id, propertyKey, value, propertyKeyList, valueList, onChangeValue, onDelete }: Props) {
  const valueInputRef = useRef<HTMLInputElement>(null);

  const handleChangeKey = (_afterKey) => {
    propertyKeyList.onChangeKey(propertyKey, _afterKey.value);
  };

  const changeValue = (_val: string | number) => {
    valueInputRef.current && valueInputRef.current.blur();

    onChangeValue(propertyKey, _val);
  };

  const parseValue = (_val) => (_.isNumber(value) ? parseFloat(_val) : _val);

  const handleOnChange = useCallback(
    _.debounce((_event) => {
      const _val = parseValue(_event.target.value);

      changeValue(_val);
    }, 800),
    []
  );

  const handleEnter: KeyboardEventHandler<HTMLInputElement> = (_event) => {
    if (_event.key === 'Enter') {
      handleOnChange.cancel();

      const _val = parseValue((_event.target as HTMLInputElement).value);

      changeValue(_val);
    }
  };

  return (
    <div className={cx('property-block')}>
      {onDelete && (
        <button className={cx('delete-button')} onClick={() => onDelete(propertyKey)}>
          <i className="material-symbols-outlined">close</i>
        </button>
      )}
      {propertyKeyList ? (
        <Select
          instanceId={`${id}-property-select`}
          options={propertyKeyList.options}
          className={cx('property-header')}
          classNamePrefix={SELECTOR_CLASS_PREFIX}
          defaultValue={{ value: propertyKey, label: _.kebabCase(propertyKey) }}
          isSearchable
          styles={SELECT_STYLE}
          onChange={handleChangeKey}
        />
      ) : (
        <p className={cx('property-header')}>{propertyKey}</p>
      )}
      {valueList ? (
        <Select
          instanceId={`${id}-value-select`}
          options={valueList}
          className={cx('value-input')}
          classNamePrefix={SELECTOR_CLASS_PREFIX}
          defaultValue={{ value, label: value }}
          isSearchable
          styles={SELECT_STYLE}
          onChange={(_item) => changeValue(_item.value)}
        />
      ) : (
        <input
          ref={valueInputRef}
          className={cx('value-input')}
          defaultValue={value}
          onChange={handleOnChange}
          type={typeof value}
          onKeyPress={handleEnter}
        />
      )}
    </div>
  );
}

export default PropertyBlock;
