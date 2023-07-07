import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
const cx = classNames.bind(styles);
//
import { RootState } from '@/reducers';
import { getChartItem } from '@/src/utils/content';
import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

interface Props {}
function FlowChartViewer({}: Props) {
  const chartItems = useSelector((state: RootState) => getChartItem(state.mainDocument), shallowEqual);

  const templateDocument = useMemo(() => {}, [chartItems]);

  return <div className={cx('viewer-wrap')}></div>;
}

export default FlowChartViewer;
