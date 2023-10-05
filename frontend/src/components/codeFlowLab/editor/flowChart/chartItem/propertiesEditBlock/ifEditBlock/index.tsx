import classNames from 'classnames/bind';
import styles from './ifEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { SCROLL_CLASS_PREFIX } from '@/consts/codeFlowLab/items';
import { ChartIfItem, ChartItemType, ConnectPoint } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { MouseEventHandler, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ConnectDot from '../../connectDot';
import _ from 'lodash';
import React from 'react';

interface Props {
  id: string;
  conditions: ChartIfItem['conditions'];
  connectionVariables: ConnectPoint[];
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
}
function IfEditBlock({ id, conditions, connectionVariables, handlePointConnectStart }: Props) {
  const dispatch = useDispatch();

  const chartItems = useSelector((state: RootState) => state.mainDocument.contentDocument.items, shallowEqual);

  const conditionList: {
    condition: { point: ConnectPoint; logical: '' }[];
    functionPoint: ConnectPoint;
  }[] = useMemo(() => {
    const variableList = _.compact(connectionVariables);

    return new Array(variableList.length + 1).fill(undefined).reduce(
      (
        _acc: {
          condition: { point: ConnectPoint; logical: '' }[];
          functionPoint: ConnectPoint;
        }[],
        _cur: ConnectPoint,
        _i
      ) => {
        if (variableList.length < 1) {
          return [
            {
              condition: [],
              functionPoint: null,
            },
          ];
        }

        const _connectPoint = variableList[_i];

        if (_connectPoint) {
          const [connectType, index] = _connectPoint.id.split('condition-')[1].split('-');

          if (_acc[parseInt(index, 10)]) {
            return _acc.map((_item, _i) => {
              if (_i === parseInt(index, 10)) {
                if (connectType === 'logic') {
                  return {
                    ..._item,
                    condition: [
                      ..._item.condition,
                      {
                        point: _connectPoint,
                        logical: conditions[_connectPoint.id] || '',
                      },
                    ],
                  };
                } else {
                  return {
                    ..._item,
                    functionPoint: _connectPoint,
                  };
                }
              }

              return _item;
            });
          } else {
            return [
              ..._acc,
              {
                condition:
                  connectType === 'logic'
                    ? [{ point: _connectPoint, logical: conditions[_connectPoint.id] || '' }]
                    : [],
                functionPoint: connectType === 'logic' ? null : _connectPoint,
              },
            ];
          }
        } else {
          return _acc;
        }
      },
      []
    );
  }, [conditions, connectionVariables]);

  const handleAddProperty = () => {};

  return (
    <div>
      {(conditionList || []).map((_conditionBlock, _i) => (
        <React.Fragment key={_i}>
          <p className={cx('condition-title')}>{_i === 0 ? 'IF' : 'ELSE'}</p>
          <div key={_i} className={cx('property-wrap')}>
            <div className={cx('condition-list')}>
              <p className={cx('condition-sub-title')}>condition list</p>
              <ul>
                {_conditionBlock.condition.map((_conditionItem, _j) => (
                  <li key={_j}>
                    {_j !== 0 && (
                      <button className={cx('logical', { [SCROLL_CLASS_PREFIX]: true })}>
                        {_conditionItem.logical}
                      </button>
                    )}
                    <span className={cx('item-name')}>
                      {chartItems?.[_conditionItem.point.connectParentId].name || ''}
                    </span>

                    <ConnectDot
                      id={`${id}-condition-logic-${_i}-${_j}`}
                      parentId={id}
                      connectDir={'right'}
                      connectType={ChartItemType.variable}
                      index={_i}
                      typeIndex={_i + _j + 1}
                      connectId={_conditionItem.point?.connectId}
                      handlePointConnectStart={handlePointConnectStart}
                    />
                  </li>
                ))}
                <li>
                  <ConnectDot
                    id={`${id}-condition-logic-${_i}-${_conditionBlock.condition.length}`}
                    parentId={id}
                    connectDir={'right'}
                    connectType={ChartItemType.variable}
                    index={_i}
                    typeIndex={_i + _conditionBlock.condition.length + 1}
                    handlePointConnectStart={handlePointConnectStart}
                  />
                </li>
              </ul>
            </div>
            <p className={cx('function-connector')}>
              <span className={cx('condition-sub-title')}>function</span>
              <span className={cx('condition-sub-title')}>
                {_conditionBlock.functionPoint
                  ? `: ${chartItems?.[_conditionBlock.functionPoint.connectParentId].name}`
                  : ''}
              </span>
              <ConnectDot
                id={`${id}-condition-func-${_i}-0`}
                parentId={id}
                connectDir={'right'}
                connectType={ChartItemType.function}
                index={_i}
                typeIndex={0}
                handlePointConnectStart={handlePointConnectStart}
                connectId={_conditionBlock.functionPoint?.id}
              />
            </p>
          </div>
        </React.Fragment>
      ))}

      {(conditionList || []).length < 2 && (
        <button className={cx('property-add-button', { [SCROLL_CLASS_PREFIX]: true })} onClick={handleAddProperty}>
          <i className="material-symbols-outlined">add</i>
        </button>
      )}
    </div>
  );
}

export default IfEditBlock;
