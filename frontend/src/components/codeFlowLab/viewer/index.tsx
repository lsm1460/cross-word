import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { RootState } from '@/reducers';
import { getChartItem, getSceneId } from '@/src/utils/content';
import { useMemo } from 'react';
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

  const templateDocument = useMemo(() => {}, [selectedChartItem]);

  return <div className={cx('viewer-wrap')}></div>;
}

export default FlowChartViewer;
