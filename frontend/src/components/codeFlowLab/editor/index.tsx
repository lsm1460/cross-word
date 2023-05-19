import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems, CodeFlowChartDoc, ConnectionItems } from '@/consts/types/codeFlowLab';
import { useMemo, useState } from 'react';
import FlowChart from './flowChart';
import _ from 'lodash';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;

function CodeFlowLabEditor() {
  const [selectedSceneOrder, setSelectedSceneOrder] = useState(1);
  const [flowDoc, setFlowDoc] = useState<CodeFlowChartDoc>({
    items: {
      'test-id': {
        id: 'test-id',
        elType: ChartItemType.button,
        pos: { left: 20, top: 20 },
        zIndex: 1,
        connectionTypeList: [ConnectionItems.style, ConnectionItems.trigger],
        connectionIds: [],
      },
    },
    scene: {
      'test-scene-01': {
        itemIds: ['test-id'],
        order: 1,
      },
    },
  });

  const selectedSceneId: string = useMemo(
    () =>
      Object.keys(flowDoc.scene).filter((_sceneKey) => {
        return flowDoc.scene[_sceneKey].order === selectedSceneOrder;
      })?.[0] || '',
    [flowDoc, selectedSceneOrder]
  );

  const chartItems: CodeFlowChartDoc['items'] = useMemo(
    () => _.pickBy(flowDoc.items, (_item) => (flowDoc.scene[selectedSceneId]?.itemIds || []).includes(_item.id)),
    [flowDoc, selectedSceneId]
  );

  const moveItems: MoveItems = (_itemIds, _deltaX, _deltaY) => {
    setFlowDoc((_prev) => {
      const targetItems = _.pickBy(_prev.items, (_item) => _itemIds.includes(_item.id));
      const newPosItems = _.mapValues(targetItems, (_item) => ({
        ..._item,
        pos: { left: _item.pos.left + _deltaX, top: _item.pos.top + _deltaY },
      }));

      return {
        ..._prev,
        items: {
          ..._prev.items,
          ...newPosItems,
        },
      };
    });
  };

  return (
    <div className={cx('editor-wrap')}>
      <FlowChart chartItems={chartItems} moveItems={moveItems} />
    </div>
  );
}

export default CodeFlowLabEditor;
