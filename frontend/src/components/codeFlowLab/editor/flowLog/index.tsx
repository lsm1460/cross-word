import classNames from 'classnames/bind';
import styles from './flowLog.module.scss';
const cx = classNames.bind(styles);
//
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { useEffect, useRef } from 'react';

function FlowLog() {
  const logEl = useRef<HTMLDivElement>(null);
  const flowLogList = useSelector((state: RootState) => state.mainDocument.flowLogList);

  useEffect(() => {
    logEl.current.scrollTo(0, logEl.current.scrollHeight);
  }, [flowLogList, logEl]);

  return (
    <div className={cx('flow-log-wrap')}>
      <div className={cx('flow-log')} ref={logEl}>
        <div>
          {flowLogList.map((_log, _i) => (
            <p key={_i} className={cx(_log.type)}>
              <span>{_log.date}</span>
              {_log.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlowLog;
