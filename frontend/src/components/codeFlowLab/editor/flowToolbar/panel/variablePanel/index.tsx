import classNames from 'classnames/bind';
import styles from './variablePanel.module.scss';
const cx = classNames.bind(styles);
//
import { CHART_VARIABLE_ITEMS } from '@/consts/codeFlowLab/items';
import { ChartItemType, ChartVariableItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import _ from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PanelItemList from '../panelItemList';
import VariablePanelItem from './variablePanelItem';

interface Props {
  isSubOpen: boolean;
  setIsSubOpen: Dispatch<SetStateAction<boolean>>;
}
function VariablePanel({ isSubOpen, setIsSubOpen }: Props) {
  const globalVariables = useSelector(
    (state: RootState) =>
      _.pickBy(
        state.mainDocument.contentDocument.items,
        (_item) => _item.elType === ChartItemType.variable && !_item.sceneId
      ),
    shallowEqual
  );

  return (
    <div className={cx('variable-panel-wrap')}>
      <PanelItemList itemList={CHART_VARIABLE_ITEMS} ableSearch={false} />
      <div className={cx('globals-variable-wrap')}>
        <input
          type="checkbox"
          id="globalVariableOpener"
          hidden
          checked={isSubOpen}
          onChange={(_event) => setIsSubOpen(_event.target.checked)}
        />
        <label htmlFor="globalVariableOpener" tabIndex={1}>
          <i className="material-symbols-outlined">keyboard_arrow_right</i>
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
          global variables list ({Object.keys(globalVariables).length})
        </label>
        <ul>
          {Object.values(globalVariables).map((_item: ChartVariableItem) => (
            <li key={_item.id}>
              <VariablePanelItem chartItem={_item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VariablePanel;
