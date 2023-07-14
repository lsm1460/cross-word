import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem, getSceneId } from '@/src/utils/content';
import { clearHistory } from '@/src/utils/history';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import FlowChartViewer from '../viewer';
import FlowChart from './flowChart';
import FlowHeader from './flowHeader';
import FlowToolbar from './flowToolbar';
import FlowZoom from './flowZoom';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;
export type ConnectPoints = (_prev: PointPos, _next: PointPos) => void;

function CodeFlowLabEditor() {
  const dispatch = useDispatch();

  const [moveItemInfo, setMoveItemInfo] = useState<{ ids: string[]; deltaX: number; deltaY: number }>(null);

  const { chartItems, sceneItemIds, itemsPos } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      itemsPos: state.mainDocument.contentDocument.itemsPos,
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  useEffect(() => {
    clearHistory();
  }, []);

  useEffect(() => {
    if (moveItemInfo && (moveItemInfo.deltaX || moveItemInfo.deltaY)) {
      const targetItems = _.pickBy(selectedChartItem, (_item) => moveItemInfo.ids.includes(_item.id));

      const operations: Operation[] = Object.values(targetItems).map((_item) => {
        return {
          key: `itemsPos.${_item.id}`,
          value: {
            left: itemsPos[_item.id].left + moveItemInfo.deltaX,
            top: itemsPos[_item.id].top + moveItemInfo.deltaY,
          },
        };
      });

      dispatch(setDocumentValueAction(operations));

      setMoveItemInfo(null);
    }
  }, [moveItemInfo, selectedChartItem]);

  const moveItems: MoveItems = (_itemIds, _deltaX, _deltaY) => {
    setMoveItemInfo({ ids: _itemIds, deltaX: _deltaX, deltaY: _deltaY });
  };

  const connectPoints: ConnectPoints = (_prevPos, _nextPos) => {
    const targetItems = _.pickBy(selectedChartItem, (_item) => [_prevPos.id, _nextPos.id].includes(_item.id));
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

  return (
    <>
      <FlowHeader />
      <div className={cx('editor-wrap')}>
        <FlowToolbar />
        <div className={cx('canvas-area')}>
          <FlowZoom>
            <FlowChart moveItems={moveItems} connectPoints={connectPoints} />
          </FlowZoom>
        </div>
        <FlowChartViewer />
      </div>
    </>
  );
}

export default CodeFlowLabEditor;
