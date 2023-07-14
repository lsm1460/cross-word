import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getChartItem, getSceneId } from '@/src/utils/content';
import React, { useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

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

  const makeViewerDocument = (_chartItem: ChartItem) => {
    return {
      ..._chartItem,
      children: _chartItem.connectionIds.right.map((_id) => makeViewerDocument(selectedChartItem[_id])),
    };
  };

  const templateDocument = useMemo(() => makeViewerDocument(selectedChartItem[ROOT_BLOCK_ID]), [selectedChartItem]);

  return <div className={cx('viewer-wrap')}></div>;
}

export default React.memo(FlowChartViewer);
