import classNames from 'classnames/bind';
import styles from './ifEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartIfItem, ChartItemType } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CONNECT_POINT_CLASS, FLOW_ITEM_ADDITIONAL_INFO, SCROLL_CLASS_PREFIX } from '@/consts/codeFlowLab/items';
import { MouseEventHandler } from 'react';
import ConnectDot from '../../connectDot';

interface Props {
  id: string;
  conditionList: ChartIfItem['conditionList'];
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
}
function IfEditBlock({ id, conditionList, handlePointConnectStart }: Props) {
  const dispatch = useDispatch();

  const chartItems = useSelector((state: RootState) => state.mainDocument.contentDocument.items, shallowEqual);

  const handleAddProperty = () => {
    const value = [...conditionList, FLOW_ITEM_ADDITIONAL_INFO[ChartItemType.if].conditionList[0]];
    const operation: Operation = { key: `items.${id}.conditionList`, value };

    dispatch(setDocumentValueAction(operation));
  };

  return (
    <div>
      <div className={cx('property-scroll-area', { [SCROLL_CLASS_PREFIX]: true })}>
        {conditionList.map((_conditionBlock, _i) => (
          <div key={_i} className={cx('property-wrap')}>
            <div className={cx('condition-list')}>
              <p className={cx('condition-sub-title')}>condition list</p>
              <ul>
                {_conditionBlock.condition.map((_conditionItem, _j) => (
                  <li key={_j}>
                    {_j !== 0 && (
                      <span className={cx('logical', { [SCROLL_CLASS_PREFIX]: true })}>{_conditionItem.logical}</span>
                    )}
                    <span className={cx('item-name')}>{chartItems?.[_conditionItem.point.connectParentId] || ''}</span>

                    <ConnectDot
                      id={`${id}-dot-${_i}-${_j}`}
                      parentId={id}
                      connectDir={'right'}
                      connectType={ChartItemType.variable}
                      index={_i}
                      typeIndex={_j}
                      connectId={_conditionItem.point?.connectId}
                      handlePointConnectStart={handlePointConnectStart}
                    />
                  </li>
                ))}
                <li>
                  <ConnectDot
                    id={`${id}-dot-${_i}-${_conditionBlock.condition.length}`}
                    parentId={id}
                    connectDir={'right'}
                    connectType={ChartItemType.variable}
                    index={_i}
                    typeIndex={_conditionBlock.condition.length}
                    handlePointConnectStart={handlePointConnectStart}
                  />
                </li>
              </ul>
            </div>
            <p className={cx('function-connector')}>
              <span className={cx('condition-sub-title')}>function</span>
            </p>
          </div>
        ))}
      </div>

      <button className={cx('property-add-button', { [SCROLL_CLASS_PREFIX]: true })} onClick={handleAddProperty}>
        <i className="material-symbols-outlined">add</i>
      </button>
    </div>
  );
}

export default IfEditBlock;
