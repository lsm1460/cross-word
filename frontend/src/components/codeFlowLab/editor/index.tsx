import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem } from '@/src/utils/content';
import { clearHistory } from '@/src/utils/history';
import _ from 'lodash';
import { useEffect, useState } from 'react';
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

  const chartItems = useSelector((state: RootState) => getChartItem(state.mainDocument), shallowEqual);

  useEffect(() => {
    clearHistory();
  }, []);

  useEffect(() => {
    if (moveItemInfo && (moveItemInfo.deltaX || moveItemInfo.deltaY)) {
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
