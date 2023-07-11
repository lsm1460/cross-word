import classNames from 'classnames/bind';
import styles from './propertyBlock.module.scss';
const cx = classNames.bind(styles);
//
import Select from 'react-select';
import _ from 'lodash';
import { SELECTOR_CLASS_PREFIX } from '@/consts/codeFlowLab/items';

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

interface Props {
  id: string;
  propertyKey: string;
  value: number | string | string[];
  onChangeValue: (_key: string, _value: number | string) => void;
  keyList?: {
    options: { value: any; label: string; isDisabled?: boolean }[];
    onChangeKey: (_beforeKey: string, _key: string) => void;
  };
  valueList?: string[];
  onDelete?: (_key: string) => void;
}
function PropertyBlock({ id, propertyKey, value, keyList, valueList, onDelete }: Props) {
  const handleChangeKey = (_afterKey) => {};

  return (
    <div>
      {keyList ? (
        <Select
          instanceId={`property-select-${id}`}
          options={keyList.options}
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
      {propertyKey}: {value}
    </div>
  );
}

export default PropertyBlock;
