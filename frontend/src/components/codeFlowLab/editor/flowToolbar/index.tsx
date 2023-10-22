import classNames from 'classnames/bind';
import styles from './flowToolbar.module.scss';
const cx = classNames.bind(styles);
//
import { ZOOM_AREA_ELEMENT_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem, getSceneId } from '@/src/utils/content';
import { useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeNewItem } from '../flowChart/utils';
import ToolbarPanel from './panel';

function FlowToolbar() {
  const dispatch = useDispatch();

  const { chartItems, itemsPos, selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      itemsPos: state.mainDocument.contentDocument.itemsPos,
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  const [panel, setPanel] = useState<'element' | 'function' | 'variable' | ''>('');

  const makeItem = (_itemType: ChartItemType) => {
    const zoomArea = document.getElementById(ZOOM_AREA_ELEMENT_ID);

    const [newFlowItem, pos, newItemId] = makeNewItem(
      zoomArea,
      chartItems,
      selectedChartItem,
      itemsPos,
      _itemType,
      selectedSceneId
    );

    const operations: Operation[] = [
      {
        key: 'items',
        value: {
          ...chartItems,
          [newItemId]: newFlowItem,
        },
      },
      {
        key: `itemsPos`,
        value: {
          ...itemsPos,
          [newItemId]: pos,
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
          <button onClick={() => setPanel((_prev) => (_prev !== 'function' ? 'function' : ''))}>Script</button>
        </li>
        <li className={cx('toolbar-item', 'variable', { active: panel === 'variable' })}>
          <button onClick={() => setPanel((_prev) => (_prev !== 'variable' ? 'variable' : ''))}>Variable</button>
        </li>
      </ul>

      <ToolbarPanel activePanel={panel} handleClosePanel={() => setPanel('')} />
    </div>
  );
}

export default FlowToolbar;
