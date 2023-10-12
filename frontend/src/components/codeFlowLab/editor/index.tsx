import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction, setFlowLogAction } from '@/reducers/contentWizard/mainDocument';
import {
  getChartItem,
  getConnectOperationsForBlockToBlock,
  getConnectOperationsForCondition,
  getConnectOperationsForVariable,
  getSceneId,
} from '@/src/utils/content';
import { clearHistory } from '@/src/utils/history';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import FlowChartViewer from '../viewer';
import FlowChart from './flowChart';
import FlowHeader from './flowHeader';
import FlowLog from './flowLog';
import FlowTabs from './flowTabs';
import FlowToolbar from './flowToolbar';
import FlowZoom from './flowZoom';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;
export type ConnectPoints = (_prev: PointPos, _next?: PointPos, _delete?: PointPos) => void;

function CodeFlowLabEditor() {
  const dispatch = useDispatch();

  const [moveItemInfo, setMoveItemInfo] = useState<{ ids: string[]; deltaX: number; deltaY: number }>(null);

  const { selectedSceneId, chartItems, sceneItemIds, itemsPos } = useSelector((state: RootState) => {
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

    const _date = dayjs().format('HH:mm ss');

    dispatch(setFlowLogAction({ date: _date, text: '코드 플로우 랩에 오신 여러분을 환영합니다.', type: 'system' }));
  }, []);

  useEffect(() => {
    if (moveItemInfo && (moveItemInfo.deltaX || moveItemInfo.deltaY)) {
      const targetItems = _.pickBy(selectedChartItem, (_item) => moveItemInfo.ids.includes(_item.id));

      const operations: Operation[] = Object.values(targetItems).map((_item) => {
        return {
          key: `itemsPos.${_item.id}.${selectedSceneId}`,
          value: {
            left: itemsPos[_item.id][selectedSceneId].left + moveItemInfo.deltaX,
            top: itemsPos[_item.id][selectedSceneId].top + moveItemInfo.deltaY,
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

  const connectPoints: ConnectPoints = (_prevPos, _nextPos, _deletePos) => {
    let operations: Operation[];

    const targetEltypeList = _.compact([
      selectedChartItem[_prevPos.parentId].elType,
      selectedChartItem[_nextPos?.parentId]?.elType,
      selectedChartItem[_deletePos?.parentId]?.elType,
    ]);
    //_prevPos, _nextPos, _deletePos의 id로 elType을 가져온 후 변수일 경우
    const isIfFlog = targetEltypeList.includes(ChartItemType.if);
    const isVariableFlag = !_.isEmpty(
      _.intersection(targetEltypeList, [ChartItemType.variable, ChartItemType.condition])
    );

    if (isIfFlog) {
      operations = getConnectOperationsForCondition(selectedChartItem, _prevPos, _nextPos, _deletePos);
    } else if (isVariableFlag) {
      operations = getConnectOperationsForVariable(selectedChartItem, _prevPos, _nextPos, _deletePos);
    } else {
      operations = getConnectOperationsForBlockToBlock(selectedChartItem, _prevPos, _nextPos, _deletePos);
    }

    if (operations) {
      dispatch(setDocumentValueAction(operations));
    }
  };

  return (
    <>
      <FlowHeader />
      <div className={cx('editor-wrap')}>
        <FlowToolbar />
        <div className={cx('canvas-area')}>
          <FlowTabs />
          <FlowZoom>
            <FlowChart moveItems={moveItems} connectPoints={connectPoints} />
          </FlowZoom>
          <FlowLog />
        </div>
        <FlowChartViewer />
      </div>
    </>
  );
}

export default CodeFlowLabEditor;
