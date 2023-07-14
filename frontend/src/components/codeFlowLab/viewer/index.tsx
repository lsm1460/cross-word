import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItem, ChartItemType, ChartStyleItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getChartItem, getSceneId } from '@/src/utils/content';
import React, { useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getElType } from '../editor/flowChart/utils';

interface Props {}
function FlowChartViewer({}: Props) {
  const { chartItems, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  const makeStylePropReduce = (_acc = {}, _curId: string) => {
    const _childStyle = selectedChartItem[_curId].connectionIds.right.reduce(makeStylePropReduce, {});

    return {
      ..._acc,
      ...(selectedChartItem[_curId] as ChartStyleItem).styles,
      ..._childStyle,
    };
  };

  const makeViewerDocument = (_chartItem: ChartItem) => {
    return {
      ..._chartItem,
      styles: _chartItem.connectionIds.right
        .filter((_id) => selectedChartItem[_id].elType === ChartItemType.style)
        .reduce(makeStylePropReduce, {}),
      children: _chartItem.connectionIds.right
        .filter((_id) => [ChartItemType.el, ChartItemType.span].includes(getElType(selectedChartItem[_id].elType)))
        .map((_id) => makeViewerDocument(selectedChartItem[_id])),
    };
  };

  const templateDocument = useMemo(() => makeViewerDocument(selectedChartItem[ROOT_BLOCK_ID]), [selectedChartItem]);

  console.log('templateDocument', templateDocument);

  return <div className={cx('viewer-wrap')}></div>;
}

export default React.memo(FlowChartViewer);
