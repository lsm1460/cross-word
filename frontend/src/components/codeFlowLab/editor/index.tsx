import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { CodeFlowChartDoc, PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FlowChartViewer from '../viewer';
import FlowChart from './flowChart';
import FlowHeader from './flowHeader';
import FlowToolbar from './flowToolbar';
import FlowZoom from './flowZoom';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;
export type ConnectPoints = (_prev: PointPos, _next: PointPos) => void;

function CodeFlowLabEditor() {
  const dispatch = useDispatch();

  const [selectedSceneOrder, setSelectedSceneOrder] = useState(1);
  const [moveItemInfo, setMoveItemInfo] = useState<{ ids: string[]; deltaX: number; deltaY: number }>(null);

  const flowDoc = useSelector((state: RootState) => state.mainDocument.contentDocument);

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

  useEffect(() => {
    if (moveItemInfo) {
      const targetItems = _.pickBy(chartItems, (_item) => moveItemInfo.ids.includes(_item.id));

      const operations: Operation[] = Object.values(targetItems).map((_item) => {
        return {
          key: `items.${_item.id}.pos`,
          value: { left: _item.pos.left + moveItemInfo.deltaX, top: _item.pos.top + moveItemInfo.deltaY },
        };
      });

      dispatch(setDocumentValueAction(operations));

      setMoveItemInfo(null);
    }
  }, [moveItemInfo, chartItems]);

  const moveItems: MoveItems = (_itemIds, _deltaX, _deltaY) => {
    setMoveItemInfo({ ids: _itemIds, deltaX: _deltaX, deltaY: _deltaY });
  };

  const connectPoints: ConnectPoints = (_prevPos, _nextPos) => {
    const targetItems = _.pickBy(chartItems, (_item) => [_prevPos.id, _nextPos.id].includes(_item.id));
    const newTargetItems = _.mapValues(targetItems, (_item) => ({
      ..._item,
      ...(_item.id === _prevPos.id && {
        connectionIds: {
          ..._item.connectionIds,
          [_prevPos.connectType]: [..._item.connectionIds[_prevPos.connectType], _nextPos.id],
        },
      }),
      ...(_item.id === _nextPos.id && {
        connectionIds: {
          ..._item.connectionIds,
          [_nextPos.connectType]: [..._item.connectionIds[_nextPos.connectType], _prevPos.id],
        },
      }),
    }));

    const operations: Operation[] = Object.values(newTargetItems).map((_item) => ({
      key: `items.${_item.id}.connectionIds`,
      value: _item.connectionIds,
    }));

    dispatch(setDocumentValueAction(operations));
  };

  const makeItem = () => {};

  return (
    <>
      <FlowHeader />
      <div className={cx('editor-wrap')}>
        <FlowToolbar makeItem={makeItem} />
        <div className={cx('canvas-area')}>
          <FlowZoom chartItems={chartItems}>
            <FlowChart chartItems={chartItems} moveItems={moveItems} connectPoints={connectPoints} />
          </FlowZoom>
        </div>
        <FlowChartViewer chartItems={chartItems} />
      </div>
    </>
  );
}

export default CodeFlowLabEditor;
