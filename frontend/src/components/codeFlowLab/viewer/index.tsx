import classNames from 'classnames/bind';
import styles from './viewer.module.scss';
import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { useMemo } from 'react';
const cx = classNames.bind(styles);
//

interface Props {
  chartItems: CodeFlowChartDoc['items'];
}
function FlowChartViewer({ chartItems }: Props) {
  const templateDocument = useMemo(() => {}, [chartItems]);

  return <div className={cx('viewer-wrap')}></div>;
}

export default FlowChartViewer;
