import classNames from 'classnames/bind';
import styles from './flowOptionModal.module.scss';
const cx = classNames.bind(styles);
//
import { SCROLL_CLASS_PREFIX } from '@/consts/codeFlowLab/items';
import { RootState } from '@/reducers';
import { SelectOption, resetOptionModalInfoAction } from '@/reducers/contentWizard/mainDocument';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function FlowOptionModal() {
  const dispatch = useDispatch();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);

  const selectModal = useSelector((state: RootState) => state.mainDocument.selectModal);
  const isOpen = !!selectModal;

  const { optionList, isSearchable, defaultValue, onChange } = selectModal;

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (isOpen && isSearchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    const closeModal = (_event) => {
      if (_event.key === 'Escape') {
        dispatch(resetOptionModalInfoAction());
      }
    };

    window.addEventListener('keydown', closeModal);

    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target as Node)) {
        dispatch(resetOptionModalInfoAction());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: SelectOption) => {
    onChange(option.value);

    dispatch(resetOptionModalInfoAction());
  };

  const filteredOptions = optionList.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <div className={cx('options-modal-wrap', { [SCROLL_CLASS_PREFIX]: true })} ref={selectContainerRef}>
      {isSearchable && (
        <input
          ref={searchInputRef}
          className={cx('search-input', { [SCROLL_CLASS_PREFIX]: true })}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}
      <ul className={cx('options-container', { [SCROLL_CLASS_PREFIX]: true })}>
        {filteredOptions.map((option) => (
          <li
            key={option.value}
            className={cx('option', { [SCROLL_CLASS_PREFIX]: true })}
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlowOptionModal;
