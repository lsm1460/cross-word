import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItem, ChartItemType, ChartStyleItem, ConnectPoint, ViewerItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getChartItem, getSceneId } from '@/src/utils/content';
import React, { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getBlockType } from '../editor/flowChart/utils';
import ViewerElBlock from './viewerElBlock';

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

  const makeStylePropReduce = (_acc = {}, _curPoint: ConnectPoint) => {
    const _childStyle = selectedChartItem[_curPoint.connectParentId].connectionIds.right.reduce(
      makeStylePropReduce,
      {}
    );

    return {
      ..._acc,
      ...(selectedChartItem[_curPoint.connectParentId] as ChartStyleItem).styles,
      ..._childStyle,
    };
  };

  const makeScriptProps = (_chartItem: ChartItem) => {
    return {
      ..._chartItem,
      script: _chartItem.connectionIds.right.map((_point) =>
        makeScriptProps(selectedChartItem[_point.connectParentId])
      ),
    };
  };

  const makeViewerDocument = (_chartItem: ChartItem) => {
    return {
      ..._chartItem,
      styles: _chartItem.connectionIds.right
        .filter((_point) => selectedChartItem[_point.connectParentId].elType === ChartItemType.style)
        .reduce(makeStylePropReduce, {}),
      children: _chartItem.connectionIds.right
        .filter((_point) =>
          [ChartItemType.el, ChartItemType.span].includes(
            getBlockType(selectedChartItem[_point.connectParentId].elType)
          )
        )
        .map((_point) => makeViewerDocument(selectedChartItem[_point.connectParentId])),
      triggers: _chartItem.connectionIds.right
        .filter((_point) => selectedChartItem[_point.connectParentId].elType === ChartItemType.trigger)
        .map((_point) => makeScriptProps(selectedChartItem[_point.connectParentId])),
    };
  };

  const templateDocument: ViewerItem = useMemo(
    () => makeViewerDocument(selectedChartItem[ROOT_BLOCK_ID]),
    [selectedChartItem]
  );

  return (
    <div className={cx('viewer-wrap')} style={templateDocument.styles}>
      {templateDocument.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </div>
  );
}

export default React.memo(FlowChartViewer);
