import classNames from 'classnames/bind';
import styles from './optionSelector.module.scss';
const cx = classNames.bind(styles);
//
import { useEffect, useRef, useState } from 'react';
import { SELECTOR_CLASS_PREFIX } from '@/consts/codeFlowLab/items';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  options: Option[];
  onChange: (value: string | number) => void;
  defaultValue?: string | number;
  isSearchable?: boolean;
}
function OptionSelector({ options, onChange, defaultValue, isSearchable }: Props) {
  const [selectedOption, setSelectedOption] = useState(defaultValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && isSearchable) {
      searchInputRef.current?.focus();
    }

    if (!isOpen) {
      setSearchValue('');
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    onChange(option.value);
  };

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <div className={cx('select-container')} ref={selectContainerRef}>
      <div className={cx('selected-option', { active: isOpen })} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || '--선택하세요--'}
      </div>
      {isOpen && (
        <div className={cx('options-container', { [SELECTOR_CLASS_PREFIX]: true })}>
          {isSearchable && (
            <input
              ref={searchInputRef}
              className={cx('search-input', { [SELECTOR_CLASS_PREFIX]: true })}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={cx('option', { [SELECTOR_CLASS_PREFIX]: true })}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OptionSelector;
