import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems, CodeFlowChartDoc, ConnectionItems } from '@/consts/types/codeFlowLab';
import { useEffect, useMemo, useState } from 'react';
import FlowChart from './flowChart';

function CodeFlowLabEditor() {
  const [selectedSceneOrder, setSelectedSceneOrder] = useState(1);
  const [flowDoc, setFlowDoc] = useState<CodeFlowChartDoc>({
    items: {
      'test-id': {
        elType: ChartItemType.button,
        pos: { left: 20, top: 20 },
        connectionTypeList: [ConnectionItems.style, ConnectionItems.trigger],
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

  const chartItems: ChartItems[] = useMemo(
    () =>
      (flowDoc.scene[selectedSceneId]?.itemIds || []).map((_id) => {
        return flowDoc.items[_id];
      }),
    [flowDoc, selectedSceneId]
  );

  return (
    <div className={cx('editor-wrap')}>
      <FlowChart chartItems={chartItems} />
    </div>
  );
}

export default CodeFlowLabEditor;
