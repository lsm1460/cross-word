import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems, CodeFlowChartDoc, ConnectionItems } from '@/consts/types/codeFlowLab';
import { useMemo, useState } from 'react';
import FlowChart from './flowChart';
import _ from 'lodash';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;
export type ConnectPoints = (_prevId: string, _nextId: string) => void;

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
      'test-style': {
        id: 'test-style',
        elType: ChartItemType.style,
        pos: { left: 80, top: 200 },
        zIndex: 2,
        connectionIds: [],
        styles: {},
      },
    },
    scene: {
      'test-scene-01': {
        itemIds: ['test-id', 'test-style'],
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

  const connectPoints: ConnectPoints = (_prevId, _nextId) => {
    setFlowDoc((_prev) => {
      const targetItems = _.pickBy(_prev.items, (_item) => [_prevId, _nextId].includes(_item.id));
      const newTargetItems = _.mapValues(targetItems, (_item) => ({
        ..._item,
        connectionIds: [..._item.connectionIds, _item.id === _prevId ? _nextId : _prevId],
      }));

      return {
        ..._prev,
        items: {
          ..._prev.items,
          ...newTargetItems,
        },
      };
    });
  };

  return (
    <div className={cx('editor-wrap')}>
      <FlowChart chartItems={chartItems} moveItems={moveItems} connectPoints={connectPoints} />
    </div>
  );
}

export default CodeFlowLabEditor;
