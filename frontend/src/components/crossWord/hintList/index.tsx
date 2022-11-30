import classNames from 'classnames/bind';
import styles from './hintList.module.scss';
const cx = classNames.bind(styles);
//
import { HintList as HintListType } from '@/consts/types';

interface Props {
  hintGroup: HintListType;
}
function HintList({ hintGroup }: Props) {
  if (!hintGroup) {
    return <p>loading..</p>;
  }

  return (
    <div className={cx('hint-list')}>
      {Object.keys(hintGroup).map((_dirKey) => (
        <div key={_dirKey}>
          <p>{_dirKey}</p>
          <ol>
            {hintGroup[_dirKey].map((_hint, _i) => (
              <li key={_i}>
                {_hint.num} {_hint.question}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default HintList;
