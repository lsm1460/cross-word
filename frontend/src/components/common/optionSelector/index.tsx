import classNames from 'classnames/bind';
import styles from './optionSelector.module.scss';
const cx = classNames.bind(styles);
//
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SelectModal, setOptionModalInfoAction } from '@/reducers/contentWizard/mainDocument';
import { SCROLL_CLASS_PREFIX } from '@/consts/codeFlowLab/items';

export interface Props extends SelectModal {}
function OptionSelector(props: Props) {
  const dispatch = useDispatch();

  const { defaultValue } = props;

  const [selectedOption] = useState(defaultValue || '');

  const handleOpenSelectModal = () => {
    dispatch(setOptionModalInfoAction(props));
  };

  return (
    <div className={cx('select-container', SCROLL_CLASS_PREFIX)}>
      <div className={cx('selected-option', SCROLL_CLASS_PREFIX)} onClick={handleOpenSelectModal}>
        {selectedOption || '--선택하세요--'}
      </div>
    </div>
  );
}

export default OptionSelector;
