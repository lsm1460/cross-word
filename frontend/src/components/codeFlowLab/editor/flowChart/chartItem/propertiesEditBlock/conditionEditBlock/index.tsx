import classNames from 'classnames/bind';
import styles from './conditionEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartConditionItem, ConnectPoint } from '@/consts/types/codeFlowLab';
import { MouseEventHandler, useMemo } from 'react';
import TextEditBlock from '../textEditBlock';
import _ from 'lodash';
import { SCROLL_CLASS_PREFIX } from '@/consts/codeFlowLab/items';
import { useDispatch } from 'react-redux';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';

interface Props {
  id: string;
  textList: string[];
  conditions: ChartConditionItem['conditions'];
  connectionVariables: ConnectPoint[];
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
}
function ConditionEditBlock({ id, textList, conditions, connectionVariables, handlePointConnectStart }: Props) {
  const dispatch = useDispatch();

  const conditionList = useMemo(() => {
    return new Array(2).fill(undefined).map((__, _i) => textList[_i] || connectionVariables[_i]);
  }, [textList, connectionVariables]);

  const toggleLogical = (_index: number) => {
    const _list = ['==', '!=', '&&', '||'];

    const _conIndex = _list.indexOf(conditions);

    const _nextCon = _conIndex + 1 > _list.length - 1 ? _list[0] : _list[_conIndex + 1];

    dispatch(
      setDocumentValueAction({
        key: `items.${id}.conditions`,
        value: _nextCon,
      })
    );
  };

  return (
    <div>
      {conditionList.map((_condi, _i) => (
        <div className={cx('property-wrap')} key={_i}>
          {_i > 0 && (
            <button className={cx('logical', { [SCROLL_CLASS_PREFIX]: true })} onClick={() => toggleLogical(_i - 1)}>
              {conditions}
            </button>
          )}

          <TextEditBlock
            id={id}
            propertyKey={'text'}
            {...(typeof _condi === 'string' && { text: _condi })}
            {...(typeof _condi !== 'string' && {
              pointInfo: {
                pointIndex: _i,
                connectPoint: _condi,
                handlePointConnectStart,
              },
            })}
          />
        </div>
      ))}
    </div>
  );
}

export default ConditionEditBlock;
