import classNames from 'classnames/bind';
import styles from './flowToolbar.module.scss';
const cx = classNames.bind(styles);
//
import { ZOOM_AREA_ELEMENT_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeNewItem } from '../flowChart/utils';
import ToolbarPanel from './panel';
import { RootState } from '@/reducers';
import { getChartItem, getSceneId } from '@/src/utils/content';

function FlowToolbar() {
  const dispatch = useDispatch();

  const { chartItems, selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  const [panel, setPanel] = useState<'element' | 'function' | ''>('');

  const makeItem = (_itemType: ChartItemType) => {
    const zoomArea = document.getElementById(ZOOM_AREA_ELEMENT_ID);

    const [newFlowItem, newItemId] = makeNewItem(zoomArea, selectedChartItem, _itemType);

    const operations: Operation[] = [
      {
        key: 'items',
        value: {
          ...chartItems,
          [newItemId]: newFlowItem,
        },
      },
      {
        key: `scene.${selectedSceneId}.itemIds`,
        value: [...sceneItemIds, newItemId],
      },
    ];

    dispatch(setDocumentValueAction(operations));
  };

  return (
    <div className={cx('toolbar')}>
      <ul>
        <li className={cx('toolbar-item', 'element', { active: panel === 'element' })}>
          <button onClick={() => setPanel((_prev) => (_prev !== 'element' ? 'element' : ''))}>Element</button>
        </li>
        <li className={cx('toolbar-item', 'style')}>
          <button onClick={() => makeItem(ChartItemType.style)}>Style</button>
        </li>
        <li className={cx('toolbar-item', 'trigger')}>
          <button onClick={() => makeItem(ChartItemType.trigger)}>Trigger</button>
        </li>
        <li className={cx('toolbar-item', 'function', { active: panel === 'function' })}>
          <button onClick={() => setPanel((_prev) => (_prev !== 'function' ? 'function' : ''))}>Function</button>
        </li>
      </ul>

      <ToolbarPanel activePanel={panel} handleClosePanel={() => setPanel('')} />
    </div>
  );
}

export default FlowToolbar;
